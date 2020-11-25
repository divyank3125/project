const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
var passport = require('passport');
const User = require("../model/User");
const url = require('url');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check('email', 'The email you entered is invalid, please try again.').isEmail(),
       check('username', 'Username must be between 4-15 characters long.').isLength({ min: 4, max:15 }),
       check('email', 'Email address must be between 4-100 characters long, please try again.').isLength({ min: 4, max:100 }),
       check('password', 'Password must be between 8-100 characters long.').isLength({ min: 8, max:100 }),
       check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
       check('passwordMatch', 'Password must be between 8-100 characters long.').isLength({ min: 8, max:100 }),
       check('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i'),
       
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({
            //     errors: errors.array()
            // });
            if(req.body.password !== req.body.passwordMatch) {
              errors.errors.push({"msg":"Passwords do not match, please try again."});
            }
            console.log('errors :', JSON.stringify(errors.errors));
            res.render('signup', {title: 'Registration Error', errors:errors.errors});
        }else if(req.body.password !== req.body.passwordMatch) {
            let mistake = [
              {"msg":"Passwords do not match, please try again."}
            ]
            res.render('signup', {title: 'Registration Error', errors:mistake});
        } else {
          const {
              username,
              email,
              password
          } = req.body;
          try {
              let user = await User.findOne({
                  email
              });
              if (user) {
                  return res.status(400).json({
                      msg: "User Already Exists"
                  });
              }

              user = new User({
                  username,
                  email,
                  password
              });

              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(password, salt);

              await user.save();
              console.log(user.id);



              const payload = {
                  user: {
                      id: user.id
                  }
              };

              jwt.sign(
                  payload,
                  "randomString", {
                      expiresIn: 10000
                  },
                  (err, token) => {
                      if (err) throw err;
                      // res.status(200).json({
                      //     token
                      // });                                                               
                      res.render('home', {title: ''});
                  }
              );
          } catch (err) {
              console.log(err.message);
              res.status(500).send("Error in Saving");
          }
        }
    }
);

router.post(
    "/signin",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // return res.status(400).json({
        //   errors: errors.array()
        // });
        errors.errors.splice(0, 0,{"msg":"Dummy"});
        res.render('signin', {title: '', errors:errors.errors});
      }else {
        const { email, password } = req.body;
        try {
          let user = await User.findOne({
            email
          });
          
          if (!user) {
            // return res.status(400).json({
            //   message: "User Not Exist"
            // });
            let mistake = [
              {"msg":"Dummy",
                "msg":"Email entered by you does not exist. Enter correct email"}
            ]
            res.render('signin', {title: '', errors:mistake});
          } else {
              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) {
                // return res.status(400).json({
                //   message: "Incorrect Password !"
                // });
                let mistake = [
                  {"msg":"Dummy",
                    "msg":"Password is wrong. Enter correct Password."}
                ]
                res.render('signin', {title: '', errors:mistake});
              }
              else{
                const payload = {
                  user: {
                    id: user.id
                  }
                };
          
                jwt.sign(
                  payload,
                  "randomString",
                  {
                    expiresIn: 3600
                  },
                  (err, token) => {
                    if (err) throw err;
                    // res.status(200).json({
                    //   token
                    // });
                    // var string = encodeURIComponent('true');
                    // res.redirect('/profile?valid=' + string);
                    
                    req.session.name = 'GeeksforGeeks'
                    //res.redirect('/profile');
                    var authenticated = req.session.name;
                    console.log(authenticated);
                    
                    res.render('profile', {authenticated : authenticated});
                    
                  }
                );
              } 
            }
          } catch (e) {
            console.error(e);
            res.status(500).json({
              message: "Server Error"
            });
          }
        
      }
    }
  );



module.exports = router;