import { Router } from 'express';
import mongoose from 'mongoose';
import { BlogPost } from '../models/BlogPost.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const router = Router();

// GET /api/posts - Get blog posts
router.get('/', async (req, res) => {
  try {
    // If MongoDB is not connected, return empty list immediately so frontend uses cached/default posts
    if (mongoose.connection.readyState !== 1) {
      return res.json({ posts: [], message: 'MongoDB offline, using frontend defaults' });
    }

    const showAll = req.query.all === 'true';
    const filter = showAll ? {} : { published: true };
    const posts = await BlogPost.find(filter).sort({ date: -1, createdAt: -1 }).lean();
    return res.json({ posts });
  } catch (err) {
    console.error('[Posts] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve blog posts', posts: [] });
  }
});

// GET /api/posts/:id - Get single blog post by id or slug
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }],
    }).lean();

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.json({ post });
  } catch (err) {
    console.error('[Posts] Get single error:', err);
    return res.status(500).json({ error: 'Failed to retrieve blog post' });
  }
});

// POST /api/posts - Create or update blog post (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const postData = req.body;
    if (!postData.id || !postData.title) {
      return res.status(400).json({ error: 'Post id and title are required' });
    }

    const updated = await BlogPost.findOneAndUpdate(
      { id: postData.id },
      { $set: postData },
      { returnDocument: 'after', upsert: true }
    );

    return res.json({ success: true, post: updated });
  } catch (err) {
    console.error('[Posts] Upsert error:', err);
    return res.status(500).json({ error: 'Failed to save blog post' });
  }
});

// DELETE /api/posts/:id - Delete blog post (Admin protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findOne({ id: req.params.id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Clean up Cloudinary asset if available
    if (post.imagePublicId) {
      await deleteFromCloudinary(post.imagePublicId);
    }

    await BlogPost.deleteOne({ id: req.params.id });
    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    console.error('[Posts] Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
