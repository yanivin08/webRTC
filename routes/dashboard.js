const express = require('express');
const router = express.Router();
const { checkAuthenticate } = require('../config/chatauth');
const Session = require('../models/Session');
const moment = require('moment');

function randomString() {
	let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	let string_length = 5;
	let randomstring = '';
	for (let i=0; i<string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

//Dashboard Page
router.get('/session', checkAuthenticate, (req, res) => {
	const randomID = randomString();
	const sessionUser = req.user.name;

	const newSession = new Session({
		id: randomID,
		user: sessionUser,
	})

	newSession.save()
		.then(session => {

			Session.find({status: "Open"}, function(err, result) {
				if (err) {
					res.send(err);
				} else {
					let datenow = moment(Date.now())
					res.render('dashboard', {
						name: req.user.name,
						link: req.protocol + '://' + req.get('host') + '/sessions/' + randomID,
						session: result,
						date: datenow.format('ll')
					});
				}
			});

		})
		.catch(err => console.log(err));
   
});

module.exports = router;

