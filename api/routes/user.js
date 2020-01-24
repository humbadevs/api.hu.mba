const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer"); 

const UserController = require('../Controllers/user.js');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().getDate() +
      new Date().getTime() +file.originalname );
    }
});

const fileFilter = (req, file, cb) =>{
  //reject file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
  cb(null, true);
} else {
  cb(null, false)
}
  };
const upload = multer({storage: storage, 
  limits: {
  fileSize: 1024 * 1024 * 5  
},
fileFilter: fileFilter

});


const User = require("../models/user");
const checkAuth = require('../middleware/check-auth');


router.get("/user",(req, res, next) => {
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

router.get("/user/:email",checkAuth,   (req, res, next) => {
  User.find({ email: req.params.email })
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

router.post("/register", upload.single('userImage'), (req, res, next) => {

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
              password: hash,
              phonenumber : req.body.phonenumber,
              userImage: req.body.userImage
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

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
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
          token: token
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

router.delete('/user/:email', checkAuth, (req, res, next) => {
User.remove({ email: req.params.email })
    .exec()
    .then(result => {
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



  
  
  router.patch ('/:id/', UserController.updateAUser);
  
    
  
  
    
    
   


module.exports = router;
