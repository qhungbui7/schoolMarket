var db = require('../db') ; 
var shortid = require('shortid') ; 
var md5 = require('md5') ;
module.exports.index = function(req,res){
    var currentdate = new Date(); 
    var date = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear()  ;
    res.render('admin/index.pug',{date}); 
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
    let admin = /*db.get('users').find({id : dataLogin.id}).value()*/ res.locals.user ;
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
