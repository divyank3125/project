var express = require('express');
var router = express.Router();
const Record = require("../model/Record");
const { check, validationResult} = require("express-validator/check");

/**
 * @method - POST
 * @param - /insertRecord
 * @description - Insert Record
 */

router.post('/insertRecord', 
    [
        check('email', 'The email you entered is invalid, please try again.').isEmail()
    ]
    ,async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.errors.splice(0, 0,{"msg":"Dummy"});
            res.render('profile', {title: '', errors:errors.errors});
        } 
        else {
            console.log(req.body);
            // const user = {
            //  id: ++userIdCounter,
            //  name: req.body.name
            // }
            // users.push(user)
            // res.status(201).json(user)
            const {
                name,
                email,
                age,
                heartRate,
                respirationRate
            } = req.body;
            let record = await Record.findOne({
                email
            });
            console.log(record);
            if (record) {
                let mistake = [
                    {"msg":"Dummy",
                      "msg":"User Already Exists."}
                  ]
                  res.render('profile', {title: '', errors:mistake});
            }
            else {
                record = new Record({
                    name,
                    email,
                    age,
                    heartRate,
                    respirationRate
                });
                record.save();
                console.log(record.id);
                res.render('profile', {title: ''});
            }
        }
   });


/**
 * @method - POST
 * @param - /deleteRecord
 * @description - Delete Record
 */

router.post('/deleteRecord', 
    [
        check('email', 'The email you entered is invalid, please try again.').isEmail()
    ]
    ,async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.errors.splice(0, 0,{"msg":"Dummy"});
            res.render('profile', {title: '', errors:errors.errors});
        } 
        else {
            console.log(req.body);
            // const user = {
            //  id: ++userIdCounter,
            //  name: req.body.name
            // }
            const {
                email,
            } = req.body;
            let record = await Record.findOne({
                email
            });
            if (!record) {
                let mistake = [
                    {"msg":"Dummy",
                      "msg":"User does not exists. Cannot delete a Record."}
                  ]
                  res.render('profile', {title: '', errors:mistake});
            }
            else {
                var recordId = record.id;
                Record.findByIdAndDelete(recordId, function (err) {
                    if(err){ 
                        console.log(err);
                        res.render('profile', {title: ''});
                    }
                    else {
                        console.log("Successful deletion");
                        res.render('profile', {title: ''});
                    }
                    
                  });
                
            }
        }
});







module.exports = router;