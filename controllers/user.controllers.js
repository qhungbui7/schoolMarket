var db = require('../db') ;
var subFunction = require('./subFunction') ; 
var shortid = require('shortid') ;  
var md5 = require('md5') ; 
module.exports.login = function(req,res){
    res.render('login.pug') ; 
}
module.exports.register = function(req,res){
    res.render('register.pug') ; 
}
module.exports.dashboard = function(req,res){
    let user = res.locals.user ; 
    res.render('dashboard.pug',{user}) ; 
}
module.exports.renderOnSaleItem = function(req,res){
    let user =  res.locals.user ;
    let onSale = db.get('items').filter({owner: user.id ,status: 'On sale'}).value() ;   
    res.render('onSale.pug',{user,onSale}) ;
}
module.exports.waitingAccept = function(req,res){
    let user =  res.locals.user ;
    let waitingAcpt = db.get('items').filter({owner: user.id,status: 'Waiting accept'}).value() ;  
    res.render('waitingAccept.pug',{user,waitingAcpt/*,onSale*/}) ;
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
    res.render('userProfile.pug',{user}) ; 
}
module.exports.findDayUserHistory = function(req,res){
    let dateFind = req.body.dateFind ; 
    res.redirect('/admin/history/' + dateFind) ; 
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
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.postRegister = function(req,res){
    let id = req.body.id ; 
    let pass = md5(req.body.pass) ;
    let email = req.body.email ; 
    let phone = req.body.phone ; 
    let fb = req.body.fb ; 
    let name = req.body.name ; 
    let clas = req.body.class ; 
    let queue = [] 
    let cmp = db.get('users').find({id}).value() ;
    if (!cmp){
        db.get('users').push({id,pass,email,phone,fb,name,clas,queue}).write() ;
        console.log('Đăng kí thành công') ; 
        res.redirect('/user/login') ;
    }
    else {
        console.log('Tài khoản đã tồn tại') ; 
        res.redirect('/user/register') ; 
    }
}
module.exports.postLogin = function(req,res){
    let id = req.body.id ; 
    let pass = md5(req.body.pass) ; 
    let cmp = db.get('users').find({id,pass}).value() ; 
    if (!cmp){
        console.log('Sai mật khẩu hoặc tài khoản không tồn tại') ; 
        res.redirect('/user/login') ; 
        return ; 
    }
        console.log('Đăng nhập thành công') ; 
        res.cookie('id',id,{
            signed : true 
        }) ; 
        if (id === 'admin') {
            res.redirect('/admin') ;
            return ; 
        } 
        res.redirect('/user/dashboard') ; 

}
module.exports.requestAdmin = function(req,res){
    let user = res.locals.user ; 
    let data = req.body ;
    data.idItem = shortid.generate() + shortid.generate() ; 
    data.status = 'Waiting accept' ;

    
    if (md5(data.pass) !== user.pass){
        console.log('Wrong password') ;
        res.redirect('/user/formRequestAdmin') ; 
        return ; 
    } 
    data.owner = user.id ; 
    db.get('items').push(data).write() ; 
    res.redirect('/user/manage') ;
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

    res.redirect('/user/manage/waitingAccept') ;
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

    res.redirect('/user/manage/onSaleItem') ;
}
module.exports.editProfile = function(req,res){
    let user = res.locals.user ;
    let newProfile = req.body ; 
    if (user.pass !== md5(newProfile.password)){
        console.log('Sai mật khẩu') ; 
        res.redirect('/user/manage/profile') ;
        return ;
    }
    ///user.email = newProfile.email
    db.get('users')
        .find({id : user.id})
        .assign({
            email : newProfile.email , 
            fb : newProfile.fb , 
            phone : newProfile.phone , 
        }).write() ; 
    res.redirect('/user/manage/profile') ;
}
module.exports.changePass = function(req,res){
    let user = res.locals.user ; 
    let info = req.body ; 
    if (user.pass !== md5(info.oldpass)){
        console.log('Sai mật khẩu') ; 
        res.redirect('/user/manage/profile') ;
        return ; 
    }
    db.get('users')
        .find({id : user.id})
        .assign({
            pass : md5(info.pass) 
        })
        .write() ; 
    res.redirect('/user/manage/profile') ;
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
    res.redirect('/user/manage/queue') ; 
}