var db = require('../db') ;
var shortid = require('shortid') ;  
var md5 = require('md5') ; 
module.exports.login = function(req,res){
    res.render('login.pug') ; 
}
module.exports.register = function(req,res){
    res.render('register.pug') ; 
}
module.exports.dashboard = function(req,res){
    res.render('dashboard.pug') ; 
}
module.exports.manage = function(req,res){
    res.render('manage.pug') ; 
}
module.exports.formRequestAdmin = function(req,res){
    res.render('formRequestAdmin.pug') ; 
}
module.exports.logout  = function(req,res){
    res.clearCookie('id') ; 
    res.redirect('/user/login') ; 
}
module.exports.postRegister = function(req,res){
    let id = req.body.id ; 
    let name = req.body.name ; 
    let clas = req.body.class ; 
    let pass = md5(req.body.pass) ;
    /*let projects = [] ; */
    let cmp = db.get('users').find({id}).value() ;
    if (!cmp){
        db.get('users').push({id,pass}).write() ;
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
    let cmp = db.get('users').find({id}).value() ; 
    if (cmp){
        if (pass === cmp.pass) console.log('Đăng nhập thành công') ; 
        res.cookie('id',id,{
            signed : true 
        }) ; 
        if (id === 'admin') res.redirect('/admin') ; else 
        res.redirect('/user/dashboard') ; 
        return ; 
    }
        console.log('Sai mật khẩu hoặc tài khoản không tồn tại') ; 
        res.redirect('/user/login') ; 
}
module.exports.requestAdmin = function(req,res){
    let user = res.locals.user ; 
    /*email
    phone
    type 
    name 
    desItem 
    imgItem 
    dateItem
    password 
    */
    let data = req.body ;
    /*
    Chờ duyệt
    Đang bán
    Tạm đóng
    Đã dừng
    */
    data.idItem = shortid.generate() ; 
    data.status = 'Chờ duyệt' ;

    
    if (md5(data.pass) !== user.pass){
        console.log('Sai mật khẩu') ;
        res.redirect('/user/formRequestAdmin') ; 
        return ; 
    } 
    delete data.pass ;
    data.owner = user.id ; 
    console.log(data) ; 
    db.get('items').push(data).write() ; 
    res.redirect('/user/manage') ;
    
}