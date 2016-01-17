var express = require('express');
var router = express.Router();
var db = require('../db.js');
var jwt = require('jsonwebtoken');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'ToDo App'
	});
});

// The login form page
router.get('/login(\/)?', function(req, res, next) {
	res.render('login', {
		title: 'Login'
	});
});

// Add a new user
router.get('/setup', function(req, res) {
	var nick = {
		name: 'Nick Cerminara',
		password: 'password',
		admin: true
	};

	db.addToDatabase(nick, "users", function(err, result) {
		if (err) {
			res.send(err);
		}
		res.json({
			success: true
		});
	});

});

// POST / 
router.post('/authenticate', function(req, res) {
	db.fetchFromDatabase("users", {
		name: req.body.name
	}, function(err, documents) {
		if (err) {
			console.log("error on authenticate");
			res.send(err);
		}
		var user = documents[0];

		if (!user) {
			console.log("user was not defined");
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		}
		else if (user) {
			console.log("user found");
			// check if password matches
			if (user.password != req.body.password) {
				console.log("wrong password");
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			}
			else {
				console.log("correct password");
				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				console.log("sending a new token");
				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

module.exports = router;
