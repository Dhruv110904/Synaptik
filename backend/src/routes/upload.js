// backend/src/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    // basic validation: allow images, videos, pdf, docs, text
    const allowed = /jpeg|jpg|png|gif|mp4|mov|pdf|doc|docx|text|plain/;
    if (allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname))) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

const router = express.Router();

router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const file = req.file;
  const url = `/uploads/${path.basename(file.path)}`;
  res.json({ url, originalName: file.originalname, size: file.size, fileType: file.mimetype });
});

module.exports = router;
