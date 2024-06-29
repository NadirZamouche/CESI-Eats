const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Function to generate a random name
const generateRandomName = (originalName) => {
  const extension = path.extname(originalName);
  const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return `${randomName}${extension}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, generateRandomName(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.filename;
    console.log('Image Filename:', filePath);
    console.log('Image saved successfully');
    res.status(201).json({ path: filePath });
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:path', async (req, res) => {
  try {
    const imagePath = `uploads/${decodeURIComponent(req.params.path)}`;
    console.log('Decoded image path:', imagePath);

    const filePath = path.join(__dirname, '..', imagePath);
    console.log('File path to delete:', filePath);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
        return res.status(500).json({ error: 'Failed to delete file' });
      }
      res.status(200).json({ message: 'Image deleted' });
    });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
