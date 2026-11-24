import { Router } from 'express';
import mongoose from 'mongoose';
import { PortfolioItem } from '../models/PortfolioItem.js';
import { PageHeader } from '../models/PageHeader.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const router = Router();

// GET /api/portfolio - List portfolio showcases
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ portfolio: [], message: 'MongoDB offline, using frontend defaults' });
    }

    const showAll = req.query.all === 'true';
    const filter = showAll ? {} : { published: true };
    const items = await PortfolioItem.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ portfolio: items });
  } catch (err) {
    console.error('[Portfolio] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve portfolio items', portfolio: [] });
  }
});

// POST /api/portfolio - Create or update portfolio item (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const itemData = req.body;
    if (!itemData.id || !itemData.title) {
      return res.status(400).json({ error: 'Item id and title are required' });
    }

    const updated = await PortfolioItem.findOneAndUpdate(
      { id: itemData.id },
      { $set: itemData },
      { returnDocument: 'after', upsert: true }
    );

    // If updating the "Our Process" card, keep the Process page header banner in sync
    if (
      (itemData.id === 'portfolio-process' || itemData.link === '/process' || itemData.slug === 'our-process') &&
      itemData.image
    ) {
      try {
        await PageHeader.findOneAndUpdate(
          { page: 'process' },
          { $set: { 'slides.0.media': itemData.image } }
        );
      } catch (procSyncErr) {
        console.warn('[Portfolio] Process header sync error:', procSyncErr.message);
      }
    }

    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('[Portfolio] Upsert error:', err);
    return res.status(500).json({ error: 'Failed to save portfolio item' });
  }
});

// DELETE /api/portfolio/:id - Delete portfolio item (Admin protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await PortfolioItem.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Clean up Cloudinary asset if available
    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    await PortfolioItem.deleteOne({ id: req.params.id });
    return res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (err) {
    console.error('[Portfolio] Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

export default router;
