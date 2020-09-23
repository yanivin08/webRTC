const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require("mongoose");
const Session = require("../models/Session");
const moment = require("moment");

router.get('/',(req,res) => res.render('welcome'))
//Dashboard Page
router.get('/dashboard', ensureAuthenticated, function(req, res){
    Session.find({}, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            let datenow = moment(Date.now())
            res.render('dashboard', {
                name: req.user.name,
                session: result,
                date: datenow.format('ll')
            });
        }
    });
});


module.exports = router;


