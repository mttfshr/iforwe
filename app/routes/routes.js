var User      	= require('../models/user');
// var Graphnode		= require('../models/graphnode');
var neo4jdriver = require('neo4j-driver').v1;
var about = require('./about.js');

var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));
var session = driver.session();

module.exports = function(app, passport) {

app.get('/about', about.about); // / refers to the default route.
	app.get('/about/:id', about.find);
	app.post('/save', about.save);

	// show all nodes
	app.get('/graphnodes', function(req, res) {
		session
		  .run("MATCH (n) RETURN n.name")
		  .then(function (result) {
				var nodeArr = [];

		    result.records.forEach(function (record) {
		      // console.log(record);
					nodeArr.push({
						node: record
					});
				});
				res.render('pages/graphnodes.ejs', {
					graphnodes: nodeArr
				});
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	});

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user : req.user,
			message : req.flash('connectMessage')
		});
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('auth/profile.ejs', {
			user : req.user,
			message : req.flash('connectMessage')
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// Update User
	app.post('/user/update', isLoggedIn, function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				if (req.body.username) {
					updateUser.props.username = req.body.username;
				}
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});


	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('auth/login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/users', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('auth/signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/',
				failureFlash : true // allow flash messages
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('auth/connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.localEmail          = undefined;
				updateUser.props.localPassword       = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.facebookToken          = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
}
