// // user.js
// // User model logic.
// var express = require('express');
// var app = express();
// var neo4jdriver = require('neo4j-driver').v1;
//
// var driver = neo4jdriver.driver("bolt://hobby-jchojlaijildgbkedoidgipl.dbs.graphenedb.com:24786", neo4jdriver.auth.basic("sandbox", "b.bMWCbGNi43IB.87pxK609JEwiRW54"));
// var session = driver.session();
//
// var Graphnode = module.exports = function Graphnode(_node) {
// 	// all we'll really store is the node; the rest of our properties will be
// 	// derivable or just pass-through properties (see below).
// 	this._node = _node;
// }
//
// Graphnode.getAll = function (res, req, callback) {
//     session
//         .run("MATCH (n) RETURN n")
//         .then(function(result){
//             var graphnodes = [];
//             result.records.forEach(function(record){
//                 //console.log(record._fields[0]);
//                 graphnodes.push({
//                     id: record._fields[0].identity.low,
//                     name: record._fields[0].properties.name
//                 });
//             });
//         })
//         .catch(function(error){
//             console.log(error);
//         });
// };
//
//
// session
//   .run('MERGE (james:Person {name : {nameParam} }) RETURN james.name AS name', {nameParam: 'James'})
//   .then(function (result) {
//     result.records.forEach(function (record) {
//       console.log(record.get('name'));
//     });
//     session.close();
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
