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
    let users = db.get('users').filter({status :'Normal'}).value() ;
    res.render('admin/userList.pug',{admin,users}) ; 
}
module.exports.renderUsage = function(req,res){
    res.render('admin/usage.pug') ; 
}
module.exports.renderWaitingAccept = function(req,res){
    let user = res.locals.user ;
    let waitingAcpt = db.get('items').filter({status: 'Waiting accept'}).value() ;  
    let waitingAcptRent = db.get('rents').filter({status: 'Waiting accept'}).value() ;  
    res.render('admin/waitingAccept.pug',{user,waitingAcpt,waitingAcptRent}) ;
}
module.exports.renderBanned = function(req,res){
    let bannedUser = db.get('users').filter({status : 'Banned'}).value() ; 
    res.render('admin/banned.pug',{users : bannedUser}) ; 
}
module.exports.editStatus = function(req,res){
    let user = db.get('users').find({id : req.params.id}).value() ;
    res.render('admin/formStatus',{user}) ; 
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.unban = function(req,res){
    let id = req.params.id ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ; 
    db.get('history').push({
        action : 'Admin unban user',
        subject : 'admin',
        obj : id, 
        date , 
        time
    }).write();
    db.get('users').find({id}).assign({rate: 3 , status : 'Normal'}).value() ; 
    setTimeout(function(){
        res.redirect('/admin/manageUsers') ; 
        }
    ,2000) ;
    

}
module.exports.acptItem = function(req,res){
    let idItem = req.params.id ;
    let type = req.params.type ;  
    let item = db.get(type).find({idItem}).value() ; 
    db.get(type)
        .find({idItem})
        .assign({ status : 'On sale'}) 
        .write() ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    db.get('history').push({
        action : 'Admin accept request',
        item  ,
        type , 
        subject : 'admin',
        obj : item.owner,
        objInfo : '',        
        date , 
        time
    }).write();

    setTimeout(function(){
        res.redirect('/admin/waitingAccept') ;
        }
    ,2000) ;
}
module.exports.decItem = function(req,res){
    let idItem = req.params.id ; 
    let type = req.params.type ;  
    let item = db.get(type).find({idItem}).value() ; 
    db.get(type)
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
    setTimeout(function(){
        res.redirect('/admin/waitingAccept') ;
        }
    ,2000) ;
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
    setTimeout(function(){
        res.redirect('/admin/onSale') ; 
        }
    ,2000) ;

}
module.exports.changeProfile = function(req,res){
    let admin = res.locals.user ;
    let newProfile = req.body ; 
    if (admin.pass !== md5(md5(newProfile.password))){
        setTimeout(function(){
                res.redirect('/admin/profile')
            }
        ,2000) ;
        return ;
    }
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
        setTimeout(function(){
                res.redirect('/admin/profile')
            }
        ,2000) ;
}
module.exports.changePass = function(req,res){
    let admin = res.locals.user ; 
    let info = req.body ; 
    if (admin.pass !== md5(md5(info.oldpass))){
        setTimeout(function(){
            res.redirect('/admin/profile')
        }
        ,2000) ;
        return ; 
    }
    db.get('users')
    .find({id : admin.id})
    .assign({
        pass : md5(md5(info.pass)) 
    }).write() ; 
    setTimeout(function(){
        res.redirect('/admin/profile')
    }
    ,2000) ;
}
module.exports.postFormStatus = function(req,res){
    let id = req.params.id ; 
    let reason = req.body.reason ; 
    let rate = req.body.rate ; 
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    let status ='Normal'
    if (rate === '0') { 
        status = 'Banned' ;
        db.get('history').push({
            action : 'Admin ban user',
            subject : 'admin',
            obj : id, 
            date , 
            time
        }).write();
    }
    else {
        db.get('history').push({
            action : 'Admin edit rate',
            subject : 'admin',
            obj : id, 
            new : rate ,
            old : db.get('users').find({id}).value().rate ,
            date , 
            time
        }).write();
    }
    let statusHistory = db.get('users').find({id}).value().statusHistory ; 
    statusHistory.unshift({rate,date,time,reason}) ; 
    db.get('users').find({id}).assign({rate,status}).write() ; 
    setTimeout(function(){
        res.redirect('/admin/editStatus/' + id);
        }
    ,2000) ;
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
    setTimeout(function(){
        res.redirect('/admin/manageUsers') ; 
        }
    ,2000) ;
}