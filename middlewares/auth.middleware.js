var db = require('../db') ; 
module.exports.reqAuth = function(req,res,next){
    if (!req.signedCookies) {
        res.redirect('/user/login') ;
        return ;  
    }
    let cmp = db.get('users').find({id : req.signedCookies.id}).value() ; 
    if (!cmp){
        res.redirect('/user/login') ; 
        return ; 
    }
    console.log(cmp.id ,' ' , cmp.pass) ; 
    res.locals.user = cmp ; 
    next() ; 
}