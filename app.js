var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));
var session = driver.session();

// Home route
app.get('/',function(req, res){
    session
      .run("MATCH (n:Person) RETURN n")
      .then(function(result){
        var personArr = [];

        result.records.forEach(function(record){
          //console.log(record._fields[0]);
          personArr.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name
          });
        });

        res.render('index', {
          persons: personArr
        });
      })
      .catch(function(error){
        console.log(error);
      });
});

app.listen(3000);

console.log('Server started on port 3000');

module.exports = app;
