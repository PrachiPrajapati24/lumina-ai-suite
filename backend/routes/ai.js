import express from 'express';
import { protect } from '../middleware/auth.js';
import Generation from '../models/Generation.js';
import {
  generateCaption,
  generateBlog,
  generateStudyNotes,
} from '../services/gemini.js';

const router = express.Router();

// Apply auth protection to all AI generation routes
router.use(protect);

/**
 * @route   POST /api/ai/caption
 * @desc    Generate a social media caption
 * @access  Private
 */
router.post('/caption', async (req, res) => {
  try {
    const { topic, platform, tone, keywords } = req.body;

    if (!topic || !platform || !tone) {
      return res.status(400).json({ message: 'Topic, platform, and tone are required' });
    }

    // Call service to generate text
    const textOutput = await generateCaption(topic, platform, tone, keywords);

    // Save to database
    const newGeneration = await Generation.create({
      userId: req.user._id,
      toolType: 'caption',
      prompt: { topic, platform, tone, keywords },
      output: textOutput,
    });

    res.status(201).json(newGeneration);
  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ message: 'Failed to generate caption. ' + error.message });
  }
});

/**
 * @route   POST /api/ai/blog
 * @desc    Generate a blog post
 * @access  Private
 */
router.post('/blog', async (req, res) => {
  try {
    const { title, keywords, audience, length } = req.body;

    if (!title || !audience || !length) {
      return res.status(400).json({ message: 'Title/Topic, target audience, and length are required' });
    }

    // Call service to generate text
    const textOutput = await generateBlog(title, keywords, audience, length);

    // Save to database
    const newGeneration = await Generation.create({
      userId: req.user._id,
      toolType: 'blog',
      prompt: { title, keywords, audience, length },
      output: textOutput,
    });

    res.status(201).json(newGeneration);
  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({ message: 'Failed to generate blog. ' + error.message });
  }
});

/**
 * @route   POST /api/ai/notes
 * @desc    Generate structured study notes
 * @access  Private
 */
router.post('/notes', async (req, res) => {
  try {
    const { subject, topicText, detailLevel } = req.body;

    if (!subject || !topicText || !detailLevel) {
      return res.status(400).json({ message: 'Subject, topic/text, and detail level are required' });
    }

    // Call service to generate text
    const textOutput = await generateStudyNotes(subject, topicText, detailLevel);

    // Save to database
    const newGeneration = await Generation.create({
      userId: req.user._id,
      toolType: 'notes',
      prompt: { subject, topicText, detailLevel },
      output: textOutput,
    });

    res.status(201).json(newGeneration);
  } catch (error) {
    console.error('Study notes generation error:', error);
    res.status(500).json({ message: 'Failed to generate study notes. ' + error.message });
  }
});

export default router;
