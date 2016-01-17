var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var db = require('../db.js');
var jwt = require('jsonwebtoken');
var config = require('../config');

// https://stackoverflow.com/a/32170615
function makeOID(id) {
	var o_id = new ObjectID(id);
	var query = {
		_id: o_id
	};

	return query;
}

// https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/
// https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
// middleware to verify token
router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	// Usually it's the last one: req.headers.token
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			}
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

// GET all tasks
router.get(/\/tasks(\/)?([0-9]+)?$/, function(req, res) {
	db.fetchFromDatabase("todo", {}, function(err, resultData) {
		if (err) {
			res.send(err);
		}
		res.json(resultData);
	});
});

// POST / Add new task
// https://stackoverflow.com/a/12008719
router.post('/tasks(\/)?$', function(req, res) {
	db.addToDatabase(req.body, "todo", function(err, result) {
		if (err) {
			res.send(err);
		}
		db.fetchFromDatabase("todo", {}, function(resultData) {
			res.json(resultData);
		});
	});
});

// DELETE task with id
router.delete('/tasks/:_id', function(req, res) {
	db.removeFromDatabase(makeOID(req.params._id), "todo", function(err, result) {
		if (err) {
			res.send(err);
		}
		else {
			db.fetchFromDatabase("todo", {}, function(resultData) {
				res.json(resultData);
			});
		}
	});
});

// PUT / Update task with id
router.put('/tasks/:_id', function(req, res) {
	db.updateDocument(makeOID(req.params._id), req.body, "todo", function(err, result) {
		if (err) {
			res.send(err);
		}
	});
});

// PUT / Update list with id
router.put('/lists/:_id', function(req, res) {
	db.updateDocument(makeOID(req.params._id), req.body, "lists", function(err, result) {
		if (err) {
			res.send(err);
		}
	});
});

// GET lists
router.get(/lists(\/)?/, function(req, res) {
	db.fetchFromDatabase("lists", {}, function(err, resultData) {
		if (err) {
			res.send(err);
		}
		res.json(resultData);
	});
});

// POST a new list
router.post('/lists(\/)?$', function(req, res) {
	db.addToDatabase(req.body, "lists", function(err, result) {
		if (err) {
			res.send(err);
		}
		db.fetchFromDatabase("lists", {}, function(resultData) {
			res.json(resultData);
		});
	});
});

// DELETE a list
router.delete('/lists/:_id', function(req, res) {
	db.removeFromDatabase(makeOID(req.params._id), "lists", function(err, result) {
	    if(err) {
	    	res.send(err);
	    } else {
	    	db.fetchFromDatabase("lists", {}, function(resultData) {
	    		res.json(resultData);	
	    	});
	    }
	});
/*	var query = {
		name: req.query.name
	};
	// remove the list
	db.removeFromDatabase(query, "lists", function(err, result) {
		if (err) {
			res.send(err);
		}
		else {
			// remove the tasks with the list name (doesn't work :( )
			query = {
				listName: req.query.name
			};
			db.removeFromDatabase(query, "todo", function(err, result) {
				if (err) {
					res.send(err);
				}
				else {
					// Return all
					db.fetchFromDatabase({}, "todo", function(resultData) {
						res.json(resultData);
					});
				}
			});
		}
	});*/
});

router.get('/users', function(req, res) {
	db.fetchFromDatabase("users", {}, function(err, resultData) {
		if (err) {
			res.send(err);
		}
		else {
			res.json(resultData);
		}
	});
});

// Add new user
router.post('/users/:_id', function(req, res) {
	db.addToDatabase(req.body, "users", function(err, result) {
		if (err) {
			res.send(err);
		}
		else {
			res.send({
				success: true
			});
		}
	});
});



module.exports = router;