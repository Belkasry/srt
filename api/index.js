const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, "test"+path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

router.post('/uploadSubtitleFile', upload.single('subtitleFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file was uploaded.'
    });
  }
  return res.status(200).json({
    success: true,
    message: 'File was uploaded.'
  });
});

router.post('/uploadAudioFile', upload.single('audioFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file was uploaded.'
    });
  }
  return res.status(200).json({
    success: true,
    message: 'File was uploaded.'
  });
});

module.exports = {
  path: '/api',
  handler: router
};
