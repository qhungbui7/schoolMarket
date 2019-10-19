var low = require('lowdb') ; 
var FileSync = require('lowdb/adapters/FileSync') ; 
var adapter = new FileSync('db.json') ; 
var db = low(adapter) ; 
db.defaults({items :[]},{rents:[]},{unvalidatedUsers : []},{users : [    
    {
    "id": "admin",
    "email": "",
    "phone": "",
    "fb": "",
    "name": "",
    "clas": "",
    "googleForm": "https://forms.gle/8kWS3mKQTeZBfW9f8",
    "pass": "c3284d0f94606de1fd2af172aba15bf3",
    "queue": [],
    "statusHistory": []
  }
]},{history : []},{connector :[]}).write() ;
module.exports = db ;  