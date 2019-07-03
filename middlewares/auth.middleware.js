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
    if (!req.signedCookies) {
        res.redirect('/user/login') ;
        return ;  
    }

    if (!cmp){
        res.redirect('/user/login') ; 
        return ; 
    }
    console.log(cmp.id ,' ' , cmp.pass) ;
    //console.log(path) ; 
    if ( path === 'admin' && cmp.id !=='admin'){
        res.redirect('/user/login') ; 
        return ; 
    } 
    if ( path !== 'admin' && cmp.id ==='admin'){
        res.redirect('/user/login') ;
        return ;
    }

    next() ; 
}
