import { Router } from 'express';
import Bookmark, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/Bookmark';

const router = Router();

// Create a new bookmark
router.post('/', async (req, res) => {
  try {
    const { title, url, notes, tags, content } = req.body;
    const newBookmark = new Bookmark({
      title,
      url,
      collections,
      tags,
      notes,
      content
    });
    const savedBookmark = await newBookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create bookmark', error: error.message });
  }
});

// Get all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await find();
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bookmarks', error: error.message });
  }
});

// Get a single bookmark by id
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bookmark', error: error.message });
  }
});

// Update a bookmark
router.patch('/:id', async (req, res) => {
  try {
    const updatedBookmark = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json(updatedBookmark);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update bookmark', error: error.message });
  }
});

// Delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const deletedBookmark = await findByIdAndDelete(req.params.id);
    if (!deletedBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json({ message: 'Bookmark successfully deleted', deletedBookmark });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bookmark', error: error.message });
  }
});

export default router;
