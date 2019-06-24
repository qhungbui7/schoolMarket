var db = require('../db') ; 
var shortid = require('shortid') ; 
module.exports.index = function(req,res){
    let waitingAccept = db.get('items').filter({status : 'Waiting accept'}).value() ; 
    let onSale = db.get('items').filter({status : 'On sale'}).value() ;
    res.render('admin/index.pug',{waitingAccept,onSale}); 
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.acptItem = function(req,res){
    idItem = req.params.id ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'On sale'}) 
        .write() ; 
    db.get('history').push({
            action : 'Admin accept request', 
            idItem : idItem 
    });
    res.redirect('/admin/') ;

}
module.exports.decItem = function(req,res){
    idItem = req.params.id ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'Deleted'}) 
        .write() ; 
    db.get('history').push({
        action : 'Admin decline request', 
        idItem : idItem 
    })
    res.redirect('/admin/') ;
}