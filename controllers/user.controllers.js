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
module.exports.renderOnSaleItem = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    let onSale = db.get('items').filter({owner: user.id ,status: 'On sale'}).value() ;   
    res.render('onSale.pug',{user,onSale}) ;
}
module.exports.waitingAccept = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    let waitingAcpt = db.get('items').filter({owner: user.id,status: 'Waiting accept'}).value() ;  
    //let onSale = db.get('items').filter({owner: user.id ,status: 'On sale'}).value() ;   
    res.render('waitingAccept.pug',{user,waitingAcpt/*,onSale*/}) ;
}
module.exports.renderUserHistory = function(req,res){
    let date = req.params.date ;  
    let dataLogin = res.locals.user ; 
    let historySeller = db.get('users').filter({seller : dataLogin.id , date }).value() ; 
    let historyCustomer = db.get('users').filter({customer : dataLogin.id , date}).value() ; 
    let history = historySeller.concat(historyCustomer) ; 
    res.render('userHistory.pug',{history,date}) ;
}
module.exports.findDayUserHistory = function(req,res){
    let dateFind = req.body.dateFind ; 
    res.redirect('/user/manage/userHistory/' + dateFind) ; 
}
module.exports.renderQueue = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    res.render('queue.pug',{user}) ; 
}
module.exports.manage = function(req,res){
    let dataLogin = res.locals.user ; 
    let user = db.get('users').find({id : dataLogin.id}).value() ;
    /*let waitingAcpt = db.get('items').filter({owner: user.id,status: 'Waiting accept'}).value() ;  
    let onSale = db.get('items').filter({owner: user.id ,status: 'On sale'}).value() ;   */
    var currentdate = new Date(); 
    var date = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear()  ;
    res.render('manage.pug',{user,date/*,waitingAcpt,onSale*/}) ; 
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
    Waiting accept
    On sale
    Tạm đóng
    Đã dừng
    */
    data.idItem = shortid.generate() ; 
    data.status = 'Waiting accept' ;

    
    if (md5(data.pass) !== user.pass){
        console.log('Wrong password') ;
        res.redirect('/user/formRequestAdmin') ; 
        return ; 
    } 
    delete data.pass ;
    data.owner = user.id ; 
    db.get('items').push(data).write() ; 
    res.redirect('/user/manage') ;
}
module.exports.userRemoveRequest = function(req,res){
    var idItem = req.params.idItem ;
    var currentdate = new Date(); 
    var date = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear()  ;
                
    var time =  currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    db.get('history').push({
        action : 'User remove request',
        item : db.get('items').find({idItem}).value(),
        subject : res.locals.user.id,        
        date , 
        time
    }).write();
    db.get('items')
        .remove({ idItem })
        .write() ;

    res.redirect('/user/manage') ;
}