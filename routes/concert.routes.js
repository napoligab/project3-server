const router = require('express').Router();
const User = require('../models/User.model');
const Concert = require('../models/Concert.model');
const Artist = require('../models/Artist.model');
const fileUploader = require('../config/cloudinary.config');

router.post('/concerts', (req, res, next) => {
  const { artist, venue, city, date, budget, deadline, minTicket, imageUrl } =
    req.body;

  Concert.create({
    artist,
    venue,
    city,
    date,
    budget,
    deadline,
    minTicket,
    imageUrl,
    usersFunding: [],
  })
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
});

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

//Get all concerts

router.get('/concerts', (req, res, next) => {
  Concert.find()
    .populate('usersFunding')
    .populate('artist')
    .then((concerts) => res.status(200).json(projects))
    .catch((err) => res.json(err));
});

// Edit - Put

router.put('/concerts/:concertId', (req, res, next) => {
  const { concertId } = req.params;
  const { artist, venue, city, date, budget, deadline, minTicket, imageUrl } =
    req.body;

  Concert.findByIdAndUpdate(
    concertId,
    { artist, venue, city, date, budget, deadline, minTicket, imageUrl },
    { new: true }
  )
    .then((concert) => res.status(201).json(concert))
    .catch((err) => res.json(err));
});

router.delete('/concerts/:concertId', (req, res, next) => {
  const { concertId } = req.params;

  Concert.findByIdAndRemove(concertId)
    .then(() =>
      res.status(200).json({
        message: `The concert with id ${concertId} was successfully deleted`,
      })
    )
    .catch((err) => res.json(err));
});

module.exports = router;
