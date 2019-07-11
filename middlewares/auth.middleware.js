var db = require('../db') ; 
module.exports.reqAuth = function(req,res,next){
    
    let url = req.originalUrl  ;
    let path ='' ;
    let cmp = db.get('users').find({id : req.signedCookies.id}).value() ; 
    res.locals.user = cmp ; 

    
    for (let i = 1 ; i < url.length ; i++){
        if (url[i]=== '/'){
            break ; 
        }
        path+=url[i] ; 
    } 

    if (path ==='market' || path ===''){
        next() ; 
        return ;
    }
    if ((!req.signedCookies) || (!cmp) || (path === 'admin' && cmp.id !=='admin') || (path !== 'admin' && cmp.id ==='admin')){
        res.redirect('/user/login') ;
        return ;  
    }

    /*if (!cmp){
        res.redirect('/user/login') ; 
        return ; 
    }
    if ( path === 'admin' && cmp.id !=='admin'){
        res.redirect('/user/login') ; 
        return ; 
    } 
    if ( path !== 'admin' && cmp.id ==='admin'){
        res.redirect('/user/login') ;
        return ;
    }*/
    if (cmp.status === 'Banned'){
        res.render('banned.pug',{statusHistory : cmp.statusHistory}) ; 
        return ; 
    }
    next() ; 
}
