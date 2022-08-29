const fileUploader = require('../config/cloudinary.config');
const router = require('express').Router();

router.post('/upload', fileUploader.single('image'), (req, res, next) => {
  console.log('file is: ', req.file);

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.status(200).json({ fileUrl: req.file.path });
});

module.exports = router;
