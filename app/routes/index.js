var express = require('express')
var passport = require('passport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var requireRole = require('../requireRole')
var router = express.Router()
var neo4j = require('neo4j-driver').v1
var driver = neo4j.driver('bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786', neo4j.auth.basic('sandbox', 'b.bMWCbGNi43IB.87pxK609JEwiRW54'))
var session = driver.session()

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', env: env })
})

router.get('/help', function (req, res, next) {
  res.render('help', { title: 'Help', env: env })
})

router.get('/users', function (req, res, next) {
  res.render('users', { title: 'Users', env: env })
})

router.get('/schema', function (req, res, next) {
  res.render('schema', { title: 'Schema', env: env })
})

router.get('/login',
  function (req, res) {
    res.redirect('/')
  })

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/url-if-something-fails'
  }),
  function (req, res) {
    res.redirect(req.session.returnTo || '/user')
  })

router.get('/admin',
  requireRole('admin'),
  function (req, res) {
    res.render('admin')
  })

router.get('/link',
  ensureLoggedIn,
  function (req, res) {
    res.render('link', {env: env})
  })

router.get('/unauthorized', function (req, res) {
  res.render('unauthorized', {env: env})
})

router.get('/nodes', function (req, res, next) {
  session
    .run('MATCH (n) RETURN n, labels(n) as labelsArr')
    .then(function (result) {
      var nodeArr = []

      result.records.forEach(function (record) {
        nodeArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          labelsArr: record._fields[0].labels
        })
      })
      res.render('nodes', {
        graphnodes: nodeArr,
        title: 'Nodes',
        env: env
      })
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.get('/node/:id/edit', function (req, res, next) {
  var nodesArr = []
  var fields = []
  var id = req.params.id

  session
    .run('MATCH (a)  Return keys(a), a')
    .subscribe({
      onNext: function (record) {
        if (fields.length <= record._fields[0].length) {
          fields = record._fields[0]
        }
      },
      onCompleted: function () {
        session.close()
      },
      onError: function (error) {
        console.log(error)
      }
    })

  session
    .run('OPTIONAL MATCH (a) WHERE ID(a) = toInt({idParam}) RETURN keys(a), a', {idParam: id})
    .subscribe({
      onNext: function (record) {
        nodesArr.push(record._fields[1].properties)
      },
      onCompleted: function () {
              // Completed!
        session.close()
        res.render('editnode', { title: 'Edit Node', nodes: nodesArr, fields: fields })
      },
      onError: function (error) {
        console.log(error)
      }
    })
})

router.post('/artist/add', function (req, res) {
  var name = req.body.name

  session
    .run('CREATE (n:Artist {name:{nameParam}}) RETURN n.name', {nameParam: name})
    .then(function (result) {
      res.redirect('/nodes')
      session.close()
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.post('/group/add', function (req, res) {
  var name = req.body.name

  session
    .run('CREATE (n:Group {name:{nameParam}}) RETURN n.name', {nameParam: name})
    .then(function (result) {
      res.redirect('/nodes')
      session.close()
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.post('/project/add', function (req, res) {
  var name = req.body.name

  session
    .run('CREATE (n:Project {name:{nameParam}}) RETURN n.name', {nameParam: name})
    .then(function (result) {
      res.redirect('/nodes')
      session.close()
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.post('/venue/add', function (req, res) {
  var name = req.body.name

  session
    .run('CREATE (n:Venue {name:{nameParam}}) RETURN n.name', {nameParam: name})
    .then(function (result) {
      res.redirect('/nodes')
      session.close()
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.post('/save', function (req, res, next) {
  console.log('called')
  var nodes = []
  var fields = []

  session
    .run('MATCH (a)  Return keys(a), a')
    .subscribe({
      onNext: function (record) {
        if (fields.length <= record._fields[0].length) {
          fields = record._fields[0]
        }
      },
      onCompleted: function (record) {
        var setClause = 'SET '
        var id = record._fields[0].identity.low

        fields.forEach(function (field) {
          var fieldValue = field + '_value'
          setClause = setClause + 'a.' + field + " = '" + req.body[fieldValue] + "', "
        })
        if (req.body.new_label != '' && req.body.new_value != '') {
          setClause = setClause + ' a.' + req.body.new_label + " = '" + req.body.new_value + "' "
        } else { setClause = setClause.substring(0, setClause.length - 2) }
        console.log(setClause)

        session
          .run("MERGE (a {id:'" + id + "'}) " + setClause + ' RETURN keys(a), a')
          .subscribe({
            onNext: function (record) {
                          // persons.push(record._fields[1].properties);
              console.log(record._fields)
            },
            onCompleted: function () {
                          // Completed!
              session.close()
              res.redirect('editnode')
            },
            onError: function (error) {
              console.log(error)
              res.render('editnode', { title: 'Edit Node', nodes: nodes, fields: fields })
            }
          })
        session.close()
      },
      onError: function (error) {
        console.log(error)
      }
    })
})

module.exports = router
