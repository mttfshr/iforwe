var User      = require('../models/user');

module.exports = function(app, passport) {

// // Home route
// app.get('/',function(req, res){
//     session
//       .run("MATCH (n:Person) RETURN n")
//       .then(function(result){
//         var personArr = [];
//
//         result.records.forEach(function(record){
//           //console.log(record._fields[0]);
//           personArr.push({
//             id: record._fields[0].identity.low,
//             name: record._fields[0].properties.name
//           });
//         });
//
//         session
//           .run("MATCH (n:Location) RETURN n")
//           .then(function(result2){
//             var locationArr = [];
//             result2.records.forEach(function(record){
//               locationArr.push(record._fields[0].properties);
//             });
//
//             res.render('index', {
//               persons: personArr,
//               locations: locationArr
//             });
//           })
//       })
//       .catch(function(error){
//         console.log(error);
//       });
// });
//
// //Add Person route
//  app.post('/person/add', function(req, res){
//    var name = req.body.name;
//    console.log(name);
//
//   session
//     .run("CREATE(n:Person {name:{nameParam}}) RETURN n.name", {nameParam: name})
//     .then(function(result){
//       res.redirect('/');
//       session.close();
//     })
//     .catch(function(error){
//       console.log(error);
//     });
// })

// //Add Location route
// app.post('/location/add', function(req, res){
//   var city = req.body.city;
//   var state = req.body.state;
//
//   session
//     .run("CREATE(n:Location {name:{cityParam}, state:{stateParam}}) RETURN n", {cityParam: city, stateParam: state})
//     .then(function(result){
//       res.redirect('/');
//       session.close();
//     })
//     .catch(function(error){
//       console.log(error);
//     });
// })
//
// //Friends connect route
// app.post('/friends/connect', function(req, res){
//   var name1 = req.body.name1;
//   var name2 = req.body.name2;
//   var id = req.body.id;
//
//   session
//     .run("MATCH(a:Person {name:{nameParam1}}), (b:Person{name:{nameParam2}}) MERGE(a)-[r:FRIENDS]->(b) RETURN a,b", {nameParam1: name1, nameParam2: name2})
//     .then(function(result){
//       if(id && id != null){
//         res.redirect('/person/'+id);
//       } else {
//       res.redirect('/');
//     }
//       session.close();
//     })
//     .catch(function(error){
//       console.log(error);
//     });
// });
//
// //Add birthplace route
// app.post('/person/born/add', function(req, res){
//   var name = req.body.name;
//   var city = req.body.city;
//   var state = req.body.state;
//   var year = req.body.year;
//   var id = req.body.id;
//
//   session
//     .run("MATCH(a:Person {name:{nameParam}}), (b:Location{name:{cityParam}, state:{stateParam}}) MERGE(a)-[r:BORN_IN {year:{yearParam}}]->(b) RETURN a,b", {nameParam:name, cityParam:city, stateParam:state, yearParam:year})
//     .then(function(result){
//       if(id && id != null){
//         res.redirect('/person/'+id);
//       } else {
//       res.redirect('/');
//     }
//       session.close();
//     })
//     .catch(function(error){
//       console.log(error);
//     });
// });
//
// // Person route
// app.get('/person/:id', function(req, res){
//   var id = req.params.id;
//
//   session
//     .run("MATCH (a:Person) WHERE id(a)=toInt({idParam}) RETURN a.name as name", {idParam:id})
//     .then(function(result){
//       var name = result.records[0].get("name");
//
//       session
//         .run("OPTIONAL MATCH (a:Person)-[r:BORN_IN]-(b:Location) WHERE id(a)=toInt({idParam}) RETURN b.name as city, b.state as state", {idParam:id})
//         .then(function(result2){
//           var city = result2.records[0].get("city");
//           var state = result2.records[0].get("state");
//
//           session
//               .run("OPTIONAL MATCH (a:Person)-[r:FRIENDS]-(b:Person) WHERE id(a)=toInt({idParam}) RETURN b", {idParam:id})
//               .then(function(result3){
//                   var friendsArr = [];
//
//                   result3.records.forEach(function(record){
//                       if(record._fields[0] != null){
//                           friendsArr.push({
//                               id: record._fields[0].identity.low,
//                               name: record._fields[0].properties.name
//                           });
//                       }
//                   });
//
//                   res.render('person',{
//                       id:id,
//                       name:name,
//                       city:city,
//                       state: state,
//                       friends:friendsArr
//                   });
//
//                   session.close();
//               })
//               .catch(function(error){
//                   console.log(error);
//               });
//         });
//     });
// });

// normal routes ===============================================================

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

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

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

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
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

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.twitterToken          = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
