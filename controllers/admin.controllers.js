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
        .assign({ status : 'Đang bán'}) 
        .write() ; 
    res.redirect('/admin/') ;
    db.get('history').push({
        action : 'Đã thêm' , 
        idItem : idItem 
    })
}
module.exports.decItem = function(req,res){
    idItem = req.params.id ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'Tạm xoá'}) 
        .write() ; 
    db.get('history').push({
        action : 'Đã từ chối' , 
        idItem : idItem 
    })
    res.redirect('/admin/') ;
}