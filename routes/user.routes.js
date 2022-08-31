const router = require('express').Router();
const User = require('../models/User.model');
const Concert = require('../models/Concert.model');
const Artist = require('../models/Request.model');
const fileUploader = require('../config/cloudinary.config');


 // Cloudinary route

router.post('/upload', fileUploader.single('imageUrl'), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

// Display User profile

router.get('/user/:userId', (req, res, next) => {
  const { userId } = req.params;
  
  User.findById(userId)
    .then((user) => res.status(201).json(user))
    .catch((err) => res.json(err));
});


// Edit User

router.put('/edit/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { firstName, lastName, email, city, creditCard, profilePicture } = req.body;
   
  User.findByIdAndUpdate(userId, {  firstName, lastName, email, city, creditCard, profilePicture }, { new: true })
    .then((user) => res.status(201).json(user))
    .catch((err) => res.json(err));
});

// Get funded-concerts by Id

router.get('/funded-concerts/:userId', (req, res, next) => {
  const {userId} = req.params;

  User.findById(userId)
    .populate('fundedConcerts') 
    .then((concerts) => res.status(200).json(concerts))
    .catch((err) => res.json(err));
});

// Delete user

router.delete('/user/:userId', (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndRemove(userId)
    .then(() =>
      res.status(200).json({
        message: `Your profile with id ${userId} was successfully deleted`,
      })
    )
    .catch((err) => res.json(err));
});


module.exports = router;