import express from 'express';
import { protect } from '../middleware/auth.js';
import Generation from '../models/Generation.js';

const router = express.Router();

// Apply auth protection to all history routes
router.use(protect);

/**
 * @route   GET /api/generations
 * @desc    Get all generations for logged in user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const generations = await Generation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(generations);
  } catch (error) {
    console.error('Fetch generations error:', error);
    res.status(500).json({ message: 'Failed to retrieve generation history' });
  }
});

/**
 * @route   GET /api/generations/:id
 * @desc    Get a single generation by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const generation = await Generation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!generation) {
      return res.status(404).json({ message: 'Generation item not found' });
    }

    res.json(generation);
  } catch (error) {
    console.error('Fetch single generation error:', error);
    res.status(500).json({ message: 'Failed to retrieve generation details' });
  }
});

/**
 * @route   DELETE /api/generations/:id
 * @desc    Delete a generation item
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const generation = await Generation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!generation) {
      return res.status(404).json({ message: 'Generation item not found' });
    }

    await generation.deleteOne();
    res.json({ message: 'Generation history item deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete generation error:', error);
    res.status(500).json({ message: 'Failed to delete history item' });
  }
});
router.delete('/', protect, async (req, res) => {
  try {
    await Generation.deleteMany({ user: req.user._id });

    res.json({
      message: 'All history deleted',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to delete history');
  }
});

router.put('/:id/pin', protect, async (req, res) => {
  try {
    const generation = await Generation.findById(req.params.id);

    if (!generation) {
      res.status(404);
      throw new Error('Generation not found');
    }

    generation.pinned = !generation.pinned;

    const updated = await generation.save();

    res.json(updated);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to pin generation');
  }
});
export default router;
