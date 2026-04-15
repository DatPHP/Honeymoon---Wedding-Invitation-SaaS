import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- API ROUTES ---

// Upload Image to Cloudinary
app.post('/api/upload', upload.single('file'), async (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'wedding_saas'
    });

    res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Projects: Get All for User
app.get('/api/projects', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const projects = await prisma.weddingProject.findMany({
      where: { userId: decoded.userId },
      include: { 
        template: true,
        sections: { orderBy: { order: 'asc' } }
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Projects: Create
app.post('/api/projects/create', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { title, slug, templateId } = req.body;

    // Fetch template to get default config/sections
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const templateConfig = template.config as any;
    const defaultSections = templateConfig.defaultSections || [
      { type: 'hero', content: { groomName: 'Tên Chú Rể', brideName: 'Tên Cô Dâu', date: '2026-04-27', subtitle: 'Chúng mình kết hôn rồi!' }, order: 0 }
    ];

    const project = await prisma.weddingProject.create({
      data: {
        userId: decoded.userId,
        title: title || 'Đám cưới của chúng mình',
        slug: slug,
        templateId: template.id,
        themeConfig: templateConfig.theme || {},
        sections: {
          create: defaultSections.map((s: any, i: number) => ({
            type: s.type,
            content: s.content,
            order: i
          }))
        }
      },
      include: { 
        sections: { orderBy: { order: 'asc' } },
        template: true
      }
    });
    res.json(project);
  } catch (error: any) {
    console.error('Create error:', error);
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
});

// Projects: Update
app.post('/api/projects/:id/update', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const { sections, title } = req.body;
    await prisma.section.deleteMany({ where: { projectId: req.params.id } });
    
    const project = await prisma.weddingProject.update({
      where: { id: req.params.id },
      data: {
        title,
        sections: {
          create: sections.map((s: any, i: number) => ({
            type: s.type,
            content: s.content,
            order: i
          }))
        }
      },
      include: { sections: true }
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Public: Get Wedding by Slug
app.get('/api/wedding/:slug', async (req, res) => {
  try {
    const project = await prisma.weddingProject.findUnique({
      where: { slug: req.params.slug },
      include: {
        sections: { orderBy: { order: 'asc' } },
        events: true,
        gift: true,
      },
    });
    if (!project) return res.status(404).json({ error: 'Wedding not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wedding' });
  }
});

// RSVP: Submit
app.post('/api/rsvp', async (req, res) => {
  try {
    const rsvp = await prisma.rSVP.create({
      data: req.body,
    });
    res.json(rsvp);
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit RSVP' });
  }
});

// Projects: Delete
app.delete('/api/projects/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const projectId = req.params.id;

    const project = await prisma.weddingProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== decoded.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.$transaction([
      prisma.rSVP.deleteMany({ where: { projectId } }),
      prisma.guestGroup.deleteMany({ where: { projectId } }),
      prisma.section.deleteMany({ where: { projectId } }),
      prisma.eventInfo.deleteMany({ where: { projectId } }),
      prisma.media.deleteMany({ where: { projectId } }),
      prisma.gift.deleteMany({ where: { projectId } }),
      prisma.analytics.deleteMany({ where: { projectId } }),
      prisma.projectMember.deleteMany({ where: { projectId } }),
      prisma.slugHistory.deleteMany({ where: { projectId } }),
      prisma.weddingProject.delete({ where: { id: projectId } })
    ]);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete project' });
  }
});

// Templates: Seed (Development only)
app.post('/api/templates/seed', async (req, res) => {
  try {
    const templates = [
      {
        id: 'minimalist-01',
        name: 'Thanh Lịch (Minimalist)',
        thumbnail: 'https://picsum.photos/seed/minimal/800/600',
        config: {
          theme: { primary: '#7D8E7D', secondary: '#FDFBF7', font: 'serif' },
          defaultSections: [
            { type: 'hero', content: { groomName: 'Quốc Anh', brideName: 'Thùy Chi', date: '2026-05-20', subtitle: 'Hành trình hạnh phúc bắt đầu' } },
            { type: 'story', content: { title: 'Chuyện Tình Chúng Mình', items: [{ date: '2022', title: 'Lần đầu gặp gỡ', description: 'Gặp nhau tại một quán cà phê nhỏ giữa lòng Hà Nội.' }] } },
            { type: 'gallery', content: { title: 'Album Kỷ Niệm', images: ['https://picsum.photos/seed/w1/800/800', 'https://picsum.photos/seed/w2/800/800'] } },
            { type: 'rsvp', content: { title: 'Xác Nhận Tham Dự', subtitle: 'Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.' } },
            { type: 'gift', content: { title: 'Mừng Cưới', subtitle: 'Gửi lời chúc phúc và quà mừng đến đôi trẻ.', accounts: [{ bankName: 'Vietcombank', accountNumber: '123456789', accountName: 'NGUYEN QUOC ANH' }] } }
          ]
        }
      },
      {
        id: 'romantic-02',
        name: 'Lãng Mạn (Romantic Floral)',
        thumbnail: 'https://picsum.photos/seed/floral/800/600',
        config: {
          theme: { primary: '#E29595', secondary: '#FFFFFF', font: 'cursive' },
          defaultSections: [
            { type: 'hero', content: { groomName: 'Minh Đức', brideName: 'Lan Hương', date: '2026-06-15', subtitle: 'Trọn đời bên nhau' } },
            { type: 'event', content: { title: 'Lễ Thành Hôn', events: [{ title: 'Lễ Vu Quy', side: 'BRIDE', date: '2026-06-15T08:00:00', location: 'Tư gia nhà gái', address: 'Quận 1, TP. HCM' }, { title: 'Tiệc Cưới', side: 'GROOM', date: '2026-06-15T18:00:00', location: 'Trung tâm tiệc cưới Gem Center', address: 'Quận 1, TP. HCM' }] } },
            { type: 'gallery', content: { title: 'Khoảnh Khắc Đẹp', images: ['https://picsum.photos/seed/w3/800/800', 'https://picsum.photos/seed/w4/800/800'] } },
            { type: 'rsvp', content: { title: 'Bạn Sẽ Đến Chứ?', subtitle: 'Vui lòng xác nhận trước ngày 01/06/2026.' } },
            { type: 'gift', content: { title: 'Hộp Quà Mừng', subtitle: 'Cảm ơn bạn đã chia sẻ niềm vui cùng chúng mình.', accounts: [{ bankName: 'Techcombank', accountNumber: '987654321', accountName: 'TRAN LAN HUONG' }] } }
          ]
        }
      },
      {
        id: 'modern-03',
        name: 'Hiện Đại (Modern Bold)',
        thumbnail: 'https://picsum.photos/seed/modern/800/600',
        config: {
          theme: { primary: '#1B263B', secondary: '#E9C46A', font: 'sans' },
          defaultSections: [
            { type: 'hero', content: { groomName: 'Hoàng Long', brideName: 'Phương Anh', date: '2026-12-12', subtitle: 'Save Our Date' } },
            { type: 'story', content: { title: 'Our Journey', items: [{ date: '2023', title: 'The Proposal', description: 'Một buổi tối lãng mạn tại Đà Lạt.' }] } },
            { type: 'event', content: { title: 'Wedding Schedule', events: [{ title: 'Wedding Ceremony', side: 'GROOM', date: '2026-12-12T17:00:00', location: 'JW Marriott Hotel', address: 'Quận Nam Từ Liêm, Hà Nội' }] } },
            { type: 'gallery', content: { title: 'The Gallery', images: ['https://picsum.photos/seed/w5/800/800', 'https://picsum.photos/seed/w6/800/800'] } },
            { type: 'rsvp', content: { title: 'RSVP Now', subtitle: 'Let us know if you can make it!' } },
            { type: 'gift', content: { title: 'Wedding Registry', subtitle: 'Your presence is the greatest gift.', accounts: [{ bankName: 'MB Bank', accountNumber: '111222333', accountName: 'LE HOANG LONG' }] } }
          ]
        }
      }
    ];

    for (const t of templates) {
      await prisma.template.upsert({
        where: { id: t.id },
        update: t,
        create: t
      });
    }

    // Clean up old default template if it exists
    try {
      await prisma.template.delete({
        where: { id: 'default-template-id' }
      });
    } catch (e) {
      // Ignore if not found
    }

    res.json({ success: true, message: 'Templates seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Templates: Get All
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

export default app;
