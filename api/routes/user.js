const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require('http-errors');

const User = require("../models/user");
const checkAuth = require('../middleware/check-auth');
const validation = require('../middleware/validation');

//For picture upload
const multer = require("multer");

//Setting destination folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toDateString() + file.originalname  );
    }
});

//Setting parameters for specific files
const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false)
  }
};

//Uploading picture into folder
const upload = multer({storage: storage,
  limits: {
  fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter

});

//Returns all users currently registered in an array
router.get("/users", checkAuth, (req, res) => {
  User.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Find a specific user with his _id
router.get("/user", checkAuth, (req, res) => {
  User.find({ _id: req.body._id })
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        error: "User not found"
      });
    });
});

//Create a user
router.post("/user", upload.single('userImage'), (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              birthdate: req.body.birthdate,
              // TODO: most likely needs fixes
              userImgae: req.file.path,
              password: hash,
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

//Delete a specific user with his _id
router.delete('/user', checkAuth, (req, res) => {
  User.remove({ _id: req.body._id })
      .exec()
      .then(() => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

// TODO: check for profile picture working
//Updates the data of a user
router.patch('/user', checkAuth, async (req, res, next) => {
  try {
    const id = req.body._id;

    const update = req.body;

    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, update, options);

    if (!result) {
      throw createError(404, 'User does not exist');
    }

    res.send(result);
    
  } catch (error) {
    console.log(error.message);

    if (error instanceof mongoose.CastError) {
      return next(createError(400, 'Invalid User Id'));
    }

    next(error);
  }
});

//Authenticates user and returns token
router.post("/user/auth", (req, res) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed: user not found"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "31d"
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token,
          _id: user[0]._id
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});



module.exports = router;