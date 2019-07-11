module.exports.getDay = function(){
    let currentDay = new Date() ; 
    let dd = currentDay.getDate() ;
    let mm = currentDay.getMonth() + 1 ; //JANUARY IS 0
    let yyyy = currentDay.getFullYear() ; 
    if (dd < 10) dd = '0' + dd ; 
    if (mm < 10) mm = '0' + mm ; 
    let day = dd + '-' + mm + '-' + yyyy ;
    return day ; 
}
module.exports.getTime = function(){
    let currentDay = new Date() ; 
    let hh =  currentDay.getHours() ;   
    let mm = currentDay.getMinutes() ; 
    let ss =  currentDay.getSeconds();
    
    if (hh < 10) hh = '0' + hh ; 
    if (mm < 10) mm = '0' + mm ; 
    if (ss < 10) ss = '0' + ss ;
    
    let time = hh + ':' + mm + ':' + ss ; 
    return time ; 
}
module.exports.convert = function(dateString){
    let arrDate = dateString.split('-') ; 
    let standardFormat = new Date (arrDate[2] , arrDate[1]-1 , arrDate[0]) ; 
    return standardFormat ;  
}
module.exports.convertToHTMLText = function(string){
    
    return string.replace(/\r\n/g,'<br>') ; 
}