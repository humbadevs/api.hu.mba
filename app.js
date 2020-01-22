const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoute = require('./api/routes/user');

mongoose.connect('mongodb+srv://root:' + process.env.DBPw + '@node-rest-test-trriz.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// ping pong
app.use('/ping', (req, res) => {
    res.send("pong")
});

//Routes for handling requests
app.use("/", userRoute);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//Password reset

app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordtoken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log(user);
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
       User: req.user
      });
    });
  });
  
   app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordtoken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
  
          user.password = req.body.password;
          user.resetPasswordtoken = undefined;
          user.resetPasswordExpires = undefined;
          console.log('password' + user.password  + 'and the user is' + user)
  
  user.save(function(err) {
    if (err) {
        console.log('here')
         return res.redirect('back');
    } else { 
        console.log('here2')
      req.logIn(user, function(err) {
        done(err, user);
      });
  
    }
          });
        });
      },
  
  
  
  
  
      function(user, done) {
          // console.log('got this far 4')
        var smtpTrans = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'myemail',
            pass: 'mypass'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'myemail',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTrans.sendMail(mailOptions, function(err) {
          // req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

module.exports = app;
