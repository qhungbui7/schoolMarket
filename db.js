var low = require('lowdb') ; 
var FileSync = require('lowdb/adapters/FileSync') ; 
var adapter = new FileSync('db.json') ; 
var db = low(adapter) ; 
db.defaults({items :[]},{users : []},{history : []}).write() ;
module.exports = db ;  