const router = require('express').Router();
const User = require('../models/User.model');
const Concert = require('../models/Concert.model');
const Artist = require('../models/Artist.model');
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


router.post('/concerts', (req, res, next) => {
  const { artist, venue, city, date, budget, deadline, minTicket, imageUrl } = req.body;

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

//Get all concerts

router.get('/concerts', (req, res, next) => {
  Concert.find()
    .populate('usersFunding')
    .populate('artist')
    .then((concerts) => res.status(200).json(concerts))
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


 //Here we need to show a page with a form where the user can add his contribution to an specific concert
router.get('/concerts/:concertId', (req, res, next) => {

  const {concertId} = req.params;

  Concert.findById(concertId)
    .populate('usersFunding') 
    .then((concert) => res.status(200).json(concert))
    .catch((err) => res.json(err));
});

 // Here we need to SEND the database the info with the user contribution to an specific concert
 // How to connect both information: concerts that are being funded by a specific user and users that are funding a specific concert
 // this route also needs to update the budget inside the concert model

/* router.post('/concerts/:concertId', (req, res, next) => {
  const {concertId} = params;
  const ticket = req.body;

  Concert.findByIdAndUpdate(concertId)
    .populate('usersFunding') 
    .then((concert) => res.status(200).json(concert))
    .catch((err) => res.json(err));
}); */

router.put("/concerts/:concertId/fund", async (req, res, next) => {
  try {
    const {concertId} = req.params;
    const {qtyTickets, userId} = req.body;

    await User.findByIdAndUpdate(userId, {
      $push: {
        fundedConcerts: concertId
      }
    })

    const concertToUpdate = await Concert.findById(concertId)

   const funded = await Concert.findByIdAndUpdate(concertId, {
      budget: concertToUpdate.budget - (qtyTickets * concertToUpdate.minTicket),
      $push: {
        usersFunding: userId
      }
    }, {new: true})

    res.status(201).json(funded);

  } catch (error) {
    next(error)
  }
})





module.exports = router;
