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

router.post('/createconcerts', (req, res, next) => {
  const { artist, venue, city, date, budget, deadline, minTicket, image } =
    req.body;

  Concert.create({
    artist,
    venue,
    city,
    date,
    budget,
    deadline,
    minTicket,
    image,
    usersFunding: [],
  })
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
});

//Get all concerts

router.get('/concerts', (req, res, next) => {
  Concert.find()
    .populate('usersFunding')
    .populate('artist')
    .then((concerts) => res.status(200).json(concerts))
    .catch((err) => res.json(err));
});

router.post('/concerts', (req, res, next) => {
  const {artist} = req.body;

  Concert.find()
    .populate('artist')
    .then((concerts) => res.status(200).json(concerts))
    .catch((err) => res.json(err));
});

// Edit - Put

router.put('/concerts/:concertId/edit', (req, res, next) => {
  const { concertId } = req.params;
  const { artist, venue, city, date, budget, deadline, minTicket, image } =
    req.body;

  Concert.findByIdAndUpdate(
    concertId,
    { artist, venue, city, date, budget, deadline, minTicket, image },
    { new: true }
  )
    .then((concert) => res.status(201).json(concert))
    .catch((err) => res.json(err));
});

// Delete concert

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

// Show the concert details
router.get('/concerts/:concertId', (req, res, next) => {
  const { concertId } = req.params;

  Concert.findById(concertId)
    .populate('usersFunding')
    .then((concert) => res.status(200).json(concert))
    .catch((err) => res.json(err));
});

// Updates a concert with the form on the concerts/:concertId route

router.put('/concerts/:concertId/fund', async (req, res, next) => {
  try {
    const { concertId } = req.params;
    const { qtyTickets } = req.body;
    const user = req.payload;

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          fundedConcerts: concertId,
        },
      },
      { new: true }
    );

    const concertToUpdate = await Concert.findById(concertId);

    const funded = await Concert.findByIdAndUpdate(
      concertId,
      {
        budget: concertToUpdate.budget - qtyTickets * concertToUpdate.minTicket,
        $push: {
          usersFunding: user._id,
        },
      },
      { new: true }
    );

    res.status(201).json(funded);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
