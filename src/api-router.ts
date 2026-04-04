import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.ts';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Health Check
router.get('/health', async (req, res) => {
  try {
    // Basic connectivity check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error: any) {
    console.error('Health Check Failure:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Auth: Register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Register] Attempting for email: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[Register] Password hashed');

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    console.log(`[Register] User created: ${user.id}`);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error('[Register] Error occurred:', error);
    res.status(400).json({
      error: error.message || 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Auth: Login
router.post('/auth/login', async (req, res) => {
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
router.get('/projects', async (req, res) => {
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

// Public: Get Wedding by Slug
router.get('/wedding/:slug', async (req, res) => {
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
router.post('/rsvp', async (req, res) => {
  try {
    const rsvp = await prisma.rSVP.create({
      data: req.body,
    });
    res.json(rsvp);
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit RSVP' });
  }
});

// Projects: Create
router.post('/projects/create', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Ensure a default template exists or just use a placeholder ID
    const project = await prisma.weddingProject.create({
      data: {
        userId: decoded.userId,
        title: req.body.title,
        slug: req.body.slug,
        templateId: 'default-template-id', // In real app, fetch a real template
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
router.post('/projects/:id/update', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { sections, title } = req.body;

    // Simple update: delete old sections and create new ones (or update if you have IDs)
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

export default router;
