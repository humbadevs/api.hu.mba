const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const Waiter = require("../models/waiter");


router.post("/apply", (req, res) => {
  Waiter.find({ hum_id: req.body.hum_id })
    .exec()
    .then(waiter => {
      if (waiter.length >= 1) {
        return res.redirect(process.env.redirectWaiter);
      } else {
            const waiter = new Waiter({
              _id: new mongoose.Types.ObjectId(),
              hum_id: req.body.hum_id,
              timestamp: new Date().toISOString()
            });
            waiter
              .save()
              .then(result => {
                console.log(result);
                res.redirect(process.env.redirectWaiter);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
      })
});
module.exports = router;
