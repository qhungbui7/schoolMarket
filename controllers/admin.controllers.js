var db = require('../db') ; 
var subFunction = require('./subFunction') ; 
var shortid = require('shortid') ; 
var md5 = require('md5') ;
module.exports.index = function(req,res){
    let admin = res.locals.user ;
    let date = subFunction.getDay() ; 
    res.render('admin/index.pug',{admin,date}); 
}
module.exports.renderProfile = function(req,res){
    let admin = res.locals.user ; 
    res.render('admin/profile.pug',{admin}) ;
}
module.exports.renderHistory = function(req,res){
    let date = req.params.date ;  
    let dataLogin = res.locals.user ; 
    let history = db.get('history').filter({date : req.params.date}).value() ; 
    res.render('admin/adminHistory.pug',{history,date}) ;
}
module.exports.renderOnSale = function(req,res){
    let admin =  res.locals.user ;
    let onSale = db.get('items').filter({status: 'On sale'}).value() ;   
    res.render('admin/onSale.pug',{admin,onSale}) ;
}
module.exports.renderUsers = function(req,res){
    let admin = res.locals.user ; 
    let users = db.get('users').filter({}).value() ;
    
    let posAdmin = users.findIndex(function(element){
        return (element.id === 'admin') ; 
    });
    users.splice(posAdmin,1) ; 
    res.render('admin/userList.pug',{admin,users}) ; 
}
module.exports.renderUsage = function(req,res){
    res.render('admin/usage.pug') ; 
}
module.exports.renderWaitingAccept = function(req,res){
        let user = res.locals.user ;
        let waitingAcpt = db.get('items').filter({status: 'Waiting accept'}).value() ;  
        res.render('admin/waitingAccept.pug',{user,waitingAcpt}) ;
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.acptItem = function(req,res){
    let idItem = req.params.id ; 
    let item = db.get('items').find({idItem}).value() ; 
    db.get('items')
        .find({idItem})
        .assign({ status : 'On sale'}) 
        .write() ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    db.get('history').push({
        action : 'Admin accept request',
        item  ,
        subject : 'admin',
        obj : item.owner,
        objInfo : '',        
        date , 
        time
    }).write();
    res.redirect('/admin/waitingAccept') ;

}
module.exports.decItem = function(req,res){
    let idItem = req.params.id ; 
    let item = db.get('items').find({idItem}).value() ; 
    db.get('items')
        .remove({idItem})
        .write() ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    db.get('history').push({
        action : 'Admin decline request',
        item ,
        subject : 'admin',
        obj : item.owner,
        objInfo : '',        
        date , 
        time
    }).write();
    res.redirect('/admin/waitingAccept') ;
}
module.exports.removeItem = function(req,res){
    let idItem = req.params.idItem ;
    let item = db.get('items').find({idItem}).value() ;
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    db.get('history').push({
        action : 'Admin remove item',
        item ,
        subject : 'admin',
        obj : item.owner,
        objInfo : '',        
        date , 
        time
    }).write();
    db.get('items')
        .remove({idItem})
        .write() ; 
    res.redirect('/admin/onSale') ; 
}
module.exports.changeProfile = function(req,res){
    let admin = res.locals.user ;
    let newProfile = req.body ; 
    if (admin.pass !== md5(newProfile.password)){
        console.log('Sai mật khẩu') ; 
        res.redirect('/admin/profile') ;
        return ;
    }
    ///user.email = newProfile.email
    db.get('users')
        .find({id : 'admin'})
        .assign({
            name : newProfile.name , 
            clas : newProfile.clas , 
            email : newProfile.email , 
            fb : newProfile.fb , 
            phone : newProfile.phone ,
            googleForm : newProfile.googleForm  
        }).write() ; 
    res.redirect('/admin/profile') ;
}
module.exports.changePass = function(req,res){
    let admin = res.locals.user ; 
    let info = req.body ; 
    if (admin.pass !== md5(info.oldpass)){
        console.log('Sai mật khẩu') ; 
        res.redirect('/user/manage/profile') ;
        return ; 
    }
    db.get('users')
    .find({id : admin.id})
    .assign({
        pass : md5(info.pass) 
    }).write() ; 
    res.redirect('/admin/profile') ;
}
module.exports.clearAllHistory = function(req,res){
    db.get('history').remove().write()  ;
    res.redirect('/admin') ;
}
module.exports.findDay = function(req,res){
    let dateFind = req.body.dateFind ; 
    res.redirect('/admin/history/' + dateFind) ; 
}
module.exports.eliminate = function(req,res){
    let id = req.params.id ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ; 
    db.get('users')
        .remove({id})
        .write() ;
    db.get('history').push({
        action : 'Admin eliminate user',
        subject : 'admin',
        obj : id, 
        date , 
        time
    }).write();
    res.redirect('/admin/manageUsers') ; 
}