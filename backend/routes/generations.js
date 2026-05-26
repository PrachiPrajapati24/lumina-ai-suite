import express from 'express';
import { protect } from '../middleware/auth.js';
import Generation from '../models/Generation.js';

const router = express.Router();

// APPLY AUTH TO ALL ROUTES
router.use(protect);

/**
 * @route   GET /api/generations
 * @desc    Get all generations
 * @access  Private
 */
router.get('/', async (req, res) => {

  try {

    const generations =
      await Generation.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json(generations);

  } catch (error) {

    console.error(
      'Fetch generations error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to retrieve generation history',
    });
  }
});

/**
 * @route   DELETE /api/generations/delete-all
 * @desc    Delete all generations
 * @access  Private
 */
router.delete(
  '/delete-all',
  async (req, res) => {

    try {

      await Generation.deleteMany({
        userId: req.user._id,
      });

      res.json({
        message:
          'All history deleted',
      });

    } catch (error) {

      console.error(
        'Delete all history error:',
        error
      );

      res.status(500).json({
        message:
          'Failed to delete history',
      });
    }
  }
);

/**
 * @route   GET /api/generations/:id
 * @desc    Get single generation
 * @access  Private
 */
router.get('/:id', async (req, res) => {

  try {

    const generation =
      await Generation.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!generation) {

      return res.status(404).json({
        message:
          'Generation item not found',
      });
    }

    res.json(generation);

  } catch (error) {

    console.error(
      'Fetch single generation error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to retrieve generation details',
    });
  }
});

/**
 * @route   DELETE /api/generations/:id
 * @desc    Delete single generation
 * @access  Private
 */
router.delete('/:id', async (req, res) => {

  try {

    const generation =
      await Generation.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!generation) {

      return res.status(404).json({
        message:
          'Generation item not found',
      });
    }

    await generation.deleteOne();

    res.json({
      message:
        'Generation history item deleted successfully',
      id: req.params.id,
    });

  } catch (error) {

    console.error(
      'Delete generation error:',
      error
    );

    res.status(500).json({
      message:
        'Failed to delete history item',
    });
  }
});

/**
 * @route   PUT /api/generations/:id/pin
 * @desc    Toggle pin generation
 * @access  Private
 */
router.put(
  '/:id/pin',
  async (req, res) => {

    try {

      const generation =
        await Generation.findOne({
          _id: req.params.id,
          userId: req.user._id,
        });

      if (!generation) {

        return res.status(404).json({
          message:
            'Generation not found',
        });
      }

      generation.pinned =
        !generation.pinned;

      const updated =
        await generation.save();

      res.json(updated);

    } catch (error) {

      console.error(
        'Pin generation error:',
        error
      );

      res.status(500).json({
        message:
          'Failed to pin generation',
      });
    }
  }
);

export default router;