// commentRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define comment schema
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  text: {
    type: String,
    required: true
  }
});
const Comment = mongoose.model('Comment', commentSchema);

// Define comment routes
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { postId, text } = req.body;
    const newComment = await Comment.create({ postId, text });
    res.status(201).json({ comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
