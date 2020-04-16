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

// this function has to be replaced with an admin dashboard api !
router.get("/count", (req, res) => {
  key = process.env.COUNT_ENDPOINT_KEY // hardcoded api key -> I know it's bad (blame it on @toorusr)
  if (key == req.query.key) {
    Waiter.find({})
      .exec()
      .then(waiters => {
        if (waiters.length >= 1) {
          return res.json({"applied": waiters.length})
        } else {
          return res.sendStatus(404)
        }
    })
  } else {
    res.sendStatus(401)
  }
});
module.exports = router;
