var neo4jdriver = require('neo4j-driver').v1;

exports.about = function (req, res) {
    var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    var session = driver.session();
    var persons = [];
    var fields = [];
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
  .run("MATCH (a:Artist )  Return keys(a), a")
  .subscribe({
        onNext: function (record) {
            persons.push(record._fields[1].properties);
            fields = record._fields[0];
            console.log(record._fields);
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.render('pages/about.pug', { title: 'Artists',  people: persons, fields: fields });
        },
        onError: function (error) {
            console.log(error);
        }
    });

};


exports.find = function (req, res) {
    var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    var session = driver.session();
    var persons = [];
    var fields = [];

    session
  .run("MATCH (a:Artist )  Return keys(a), a")
  .subscribe({
        onNext: function (record) {
            if (fields.length <= record._fields[0].length)
                fields = record._fields[0];
        },
        onCompleted: function () {
            session.close();
        },
        onError: function (error) {
            console.log(error);
        }
    });
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
  .run("MATCH (a:Artist) where a.UniqueId = { nameParam } Return keys(a), a", { nameParam: req.params.id })
  .subscribe({
        onNext: function (record) {
            persons.push(record._fields[1].properties);
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.render('pages/about.pug', { title: 'Details', year: newDate().getFullYear(), people: persons, fields: fields });
        },
        onError: function (error) {
            console.log(error);
        }
    });
}

exports.save = function (req, res) {
    console.log('called');
    var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));
    var session = driver.session();
    var persons = [];
    var fields = [];

    session
      .run("MATCH (a:Artist )  Return keys(a), a")
      .subscribe({
            onNext: function (record) {
                if (fields.length <= record._fields[0].length)
                    fields = record._fields[0];
            },
            onCompleted: function () {
                var setClause = 'SET ';
                var uniqueIDVal = "";
                if (req.body.UniqueId_value == "")
                    uniqueIDVal = req.body.FirstName_value + req.body.LastName_value
                else
                uniqueIDVal = req.body.UniqueId_value;

                req.body.UniqueId_value = uniqueIDVal;
                fields.forEach(function (field) {
                    var fieldValue = field + "_value";
                    setClause = setClause + "a." + field + " = '" + req.body[fieldValue] + "', ";
                });
                if (req.body.new_label != "" && req.body.new_value != "")
                    setClause = setClause + " a." + req.body.new_label + " = '" + req.body.new_value + "' ";
                else
                    setClause = setClause.substring(0, setClause.length - 2);
                console.log(setClause);


                    session
                    .run("MERGE (a:Artist {UniqueId:'" + uniqueIDVal + "'}) " + setClause + " RETURN keys(a), a")
                    .subscribe({
                                onNext: function (record) {
                                    //persons.push(record._fields[1].properties);
                                    console.log(record._fields);
                                },
                                onCompleted: function () {
                                    // Completed!
                                    session.close();
                                    res.redirect("/about");
                                },
                                onError: function (error) {
                                    console.log(error);
                                    res.render('pages/about.pug', { title: 'Details', year: newDate().getFullYear(), people: persons, fields: fields });
                                }
                    });
                session.close();
            },
            onError: function (error) {
                console.log(error);
            }
    });
}
