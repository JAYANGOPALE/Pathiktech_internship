const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDictionary } = require('../controllers/dictionaryController');

// Use memory storage (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only .json files are accepted'), false);
    }
  },
});

// POST /api/dictionary — upload a pronunciation dictionary
router.post('/', upload.single('file'), uploadDictionary);

module.exports = router;
