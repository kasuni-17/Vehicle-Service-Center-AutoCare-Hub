const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Create a new feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback data:', req.body);
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    console.log('Feedback saved:', savedFeedback);
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedbacks for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ customer: req.params.customerId })
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get average rating for a service
router.get('/rating/:service', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ service: req.params.service });
    if (feedbacks.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }
    const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
    res.json({ averageRating: averageRating.toFixed(1), totalReviews: feedbacks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
