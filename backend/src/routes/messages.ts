import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get messages with user
router.get('/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: senderId!,
        receiverId,
        content,
      },
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.put('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

export default router;
