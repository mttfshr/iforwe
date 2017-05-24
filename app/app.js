var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes');
var neo4jdriver = require('neo4j-driver').v1;
var neo4j = require('neo4j');
var apoc = require('apoc');
var helmet = require('helmet');

var about = require('./routes/about.js');



var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));

require('./config/passport')(passport); // pass passport for configuration

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.engine('ejs', require('ejs').renderFile);
app.engine('pug', require('pug').__express);

// required for passport
app.use(session({ secret: 'yoursecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport);
require('./routes/users.js')(app, passport);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);
console.log('The magic happens on port ' + port);
