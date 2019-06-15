var db = require('../db') ; 
module.exports.market = function(req,res){
    var data = db.get('items').filter({status : 'Đang bán'}).value() ; 
    res.render('market/index.pug',{data}) ; 
}