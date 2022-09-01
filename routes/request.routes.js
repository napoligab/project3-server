const router = require('express').Router();
const Request = require('../models/Request.model');

 router.get('/request', (req, res, next) => {
    const user = req.payload;

      Request.find()
      .populate('author')
      .then((concerts) => res.status(200).json(concerts))
      .catch((err) => res.json(err));
  }); 
  
  // Create request
  
  router.post('/request',  (req, res, next) => {
    const { author, message } = req.body;
  
    Request.create({ author, message })
      .then((concert) => res.status(201).json(concert))
      .catch((err) => res.json(err));
  });





  module.exports = router;