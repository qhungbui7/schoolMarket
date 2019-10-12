var db = require('../db') ;
var subFunction = require('./subFunction') ; 
var shortid = require('shortid') ;  
var md5 = require('md5') ; 
module.exports.login = function(req,res){
    res.clearCookie('id') ; 
    res.render('login.pug') ; 
}
module.exports.register = function(req,res){
    res.render('register.pug') ; 
}
module.exports.dashboard = function(req,res){
    res.redirect('/user/manage') ; 
}
module.exports.renderOnSaleItem = function(req,res){
    let user =  res.locals.user ;
    let onSale = db.get('items').filter({owner: user.id ,status: 'On sale'}).value() ;   
    res.render('onSale.pug',{user,onSale}) ;
}
module.exports.waitingAccept = function(req,res){
    let user =  res.locals.user ;
    let waitingAcpt = db.get('items').filter({owner: user.id,status: 'Waiting accept'}).value() ;  
    res.render('waitingAccept.pug',{user,waitingAcpt}) ;
}
module.exports.waitingRent = function(req,res){
    let user =  res.locals.user ;
    let waitingAcpt = db.get('rents').filter({owner: user.id,status: 'Waiting accept'}).value() ;  
    res.render('waitingRent.pug',{user,waitingAcpt}) ;
}
module.exports.renderUserHistory = function(req,res){
    let date = req.params.date ;  
    let dataLogin = res.locals.user ; 
    let historySubject = db.get('history').filter({subject : dataLogin.id , date : req.params.date }).value() ; 
    let historyObject = db.get('history').filter({object : dataLogin.id , date : req.params.date }).value() ;
    res.render('userHistory.pug',{historySubject,historyObject,date}) ;
}
module.exports.renderProfile = function(req,res){
    let user = res.locals.user ; 
    res.render('userProfile.pug',{user, id:user.id}) ; 
}
module.exports.findDayUserHistory = function(req,res){
    let dateFind = req.body.dateFind ; 
    res.redirect('user/manage/userHistory/' + dateFind) ; 
}
module.exports.renderQueue = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    res.render('queue.pug',{user}) ; 
}
module.exports.renderDelivered = function(req,res){
    let user = res.locals.user ; 
    res.render('delivered.pug',{user}) ; 
}
module.exports.manage = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    let date = subFunction.getDay() ; 
    let dataAdmin = db.get('users').find({id : 'admin'}).value() ; 
    let admin =  {
        email : dataAdmin.email,
        phone : dataAdmin.phone,
        facebook : dataAdmin.fb ,
        googleForm : dataAdmin.googleForm  
    }
    res.render('manage.pug',{user,date,admin}) ; 
}
module.exports.formRequestAdmin = function(req,res){
    let user = res.locals.user ; 
    res.render('formRequestAdmin.pug',{user}) ; 
}
module.exports.formRentAdmin = function(req,res){
    let user = res.locals.user ; 
    res.render('formRentAdmin.pug',{user}) ; 
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/') ; 
}
module.exports.postRegister = function(req,res){
    let id = req.body.id ; 
    let pass = md5(md5(req.body.pass)) ;
    let email = req.body.email ; 
    let phone = req.body.phone ; 
    let fb = req.body.fb ; 
    let name = req.body.name ; 
    let clas = req.body.clas ;
    let status = 'Normal' ; 
    let rate = '10' ;  
    let queue = [] ;
    let statusHistory = [] ;
    let cmp = db.get('users').find({id}).value() ;
    if (!cmp){
        //console.log({id,pass : req.body.pass ,email,phone,fb,name,clas,status,rate,statusHistory,queue})
        db.get('users').push({id,pass,email,phone,fb,name,clas,status,rate,statusHistory,queue}).write() ;
        setTimeout(function(){
            res.redirect('/user/login') ;
        },2000) ; 
    }
    else {
        setTimeout(function(){
            res.redirect('/user/register') ; 
        },2000) ; 
    }
}
module.exports.postLogin = function(req,res){
    res.clearCookie('id') ;  
    let id = req.body.id ; 
    let pass = md5(md5(req.body.pass)) ; 
    let cmp = db.get('users').find({id,pass}).value() ; 
    if (!cmp){ 
        setTimeout(function(){
            res.redirect('/user/login')
        },2000) ; 
        return ; 
    }
        res.cookie('id',id,{
            signed : true 
        }) ; 
        if (id === 'admin') {
            setTimeout(function(){
                res.redirect('/admin')
            },2000) ; 
            return ; 
        } 
        setTimeout(function(){
            res.redirect('/market/all')
        },2000) ; 
}
module.exports.requestAdmin = function(req,res){
    let user = res.locals.user ; 
    let data = req.body ;
    data.idItem = shortid.generate() + shortid.generate() ; 
    data.status = 'Waiting accept' ;
    data.comment = []  ;

    
    if (md5(md5(data.pass)) !== user.pass){
        setTimeout(function(){
            res.redirect('/user/manage/formRequestAdmin') ; 
        },2000) ; 
        return ; 
    } 
    data.owner = user.id ; 
    db.get('items').push(data).write() ; 
    setTimeout(function(){
        res.redirect('/user/manage/formRequestAdmin') ; 
    },2000) ; 
}
module.exports.requestRentAdmin = function(req,res){
    let user = res.locals.user ; 
    let data = req.body ;
    data.idItem = shortid.generate() + shortid.generate() ; 
    data.status = 'Waiting accept' ;
    data.avatar = '/' + req.file.path.split('\\').slice(1).join('/') ; 
    console.log(data.avatar) ; 
    data.comment = []  ;

    
    if (md5(md5(data.pass)) !== user.pass){
        setTimeout(function(){
            res.redirect('/user/manage/formRentAdmin') ; 
        },2000) ; 
        return ; 
    } 
    data.owner = user.id ; 
    db.get('rents').push(data).write() ; 
    setTimeout(function(){
        res.redirect('/user/manage/formRentAdmin') ; 
    },2000) ; 
}
module.exports.userRemoveRequest = function(req,res){
    let idItem = req.params.idItem ;
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ; 

    db.get('history').push({
        action : 'User remove item',
        item : db.get('items').find({idItem}).value(),
        subject : res.locals.user.id,        
        object : '',
        objectInfo :'',
        date , 
        time
    }).write();
    
    db.get('items')
        .remove({ idItem })
        .write() ;
    setTimeout(function(){
            res.redirect('/user/manage/waitingAccept') ;
    },2000) ; 
}
module.exports.userRemoveRentRequest = function(req,res){
    let idItem = req.params.idItem ;
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ; 

    db.get('history').push({
        action : 'User remove request',
        item : db.get('rents').find({idItem}).value(),
        subject : res.locals.user.id,        
        object : '',
        objectInfo :'',
        date , 
        time
    }).write();
    
    db.get('rents')
        .remove({ idItem })
        .write() ;
    setTimeout(function(){
            res.redirect('/user/manage/waitingRentAccept') ;
    },2000) ; 
}
module.exports.userRemoveItem = function(req,res){
    let idItem = req.params.idItem ;
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;

    db.get('history').push({
        action : 'User remove item',
        item : db.get('items').find({idItem}).value(),
        subject : res.locals.user.id,        
        object : '',
        objectInfo :'',
        date , 
        time
    }).write();
    db.get('items')
        .remove({ idItem })
        .write() ;
        setTimeout(function(){
            res.redirect('/user/manage/onSaleItem') ;
        },2000) ; 
}
module.exports.editProfile = function(req,res){
    let user = res.locals.user ;
    let newProfile = req.body ; 
    if (user.pass !== md5(md5(newProfile.password))){
        setTimeout(function(){
            res.redirect('/user/manage/profile') ;
        },2000) ; 
        return ;
    }
    db.get('users')
        .find({id : user.id})
        .assign({
            email : newProfile.email , 
            fb : newProfile.fb , 
            phone : newProfile.phone , 
        }).write() ; 
        setTimeout(function(){
            res.redirect('/user/manage/profile') ;
        },2000) ; 

}
module.exports.changePass = function(req,res){
    let user = res.locals.user ; 
    let info = req.body ; 
    if (user.pass !== md5(md5(info.oldpass))){
        setTimeout(function(){
            res.redirect('/user/manage/profile') ;
        },2000) ; 
        return ; 
    }
    db.get('users')
        .find({id : user.id})
        .assign({
            pass : md5(md5(info.pass)) 
        })
        .write() ; 
    setTimeout(function(){
        res.redirect('/user/manage/profile') ;
    },2000) ; 
}   
module.exports.shipped = function(req,res){
    let index = req.params.index ; 
    let user = res.locals.user ; 
    user.queue[index].status = 'Đã giao' ; 
    db.get('users')
        .find({
            id : user.id
        }) 
        .assign({
            queue : user.queue
        })
        .write() ; 
        setTimeout(function(){
            res.redirect('/user/manage/queue') ; 
        },2000) ; 

}