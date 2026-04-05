import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/lib/prisma.ts';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- API ROUTES ---

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
      include: { template: true },
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
    
    // Find or create a default template to avoid foreign key constraint error
    let template = await prisma.template.findFirst();
    if (!template) {
      template = await prisma.template.create({
        data: {
          id: 'default-template-id',
          name: 'Default Template',
          thumbnail: 'https://picsum.photos/seed/wedding/400/300',
          config: {},
        }
      });
    }

    const project = await prisma.weddingProject.create({
      data: {
        userId: decoded.userId,
        title: req.body.title,
        slug: req.body.slug,
        templateId: template.id,
        sections: {
          create: [
            { type: 'hero', content: { groomName: 'Tên Chú Rể', brideName: 'Tên Cô Dâu', date: '2026-04-27' }, order: 0 }
          ]
        }
      },
      include: { sections: true }
    });
    res.json(project);
  } catch (error: any) {
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
