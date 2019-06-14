var db = require('../db') ; 
var shortid = require('shortid') ; 
module.exports.index = function(req,res){
    let data = db.get('items').filter({status : 'Chờ duyệt'}).value() ; 
    res.render('admin/index.pug',{data}); 
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.acptItem = function(req,res){
    idItem = req.params.id ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'Đang bán'}) // or .defaults depending on what you want to do
        .write() ; 
    res.redirect('/admin/') ;
}
module.exports.decItem = function(req,res){
    idItem = req.params.id ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'Tạm xoá'}) // or .defaults depending on what you want to do
        .write() ; 
    res.redirect('/admin/') ;
}