var crypto=require('crypto');
var config=require('../config');

var helper={};

helper.hashPassword=function(str){

    if(typeof(str)==='string' && str.length>0){
        var hashed=crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hashed;
    }else{
        return false;
    }
}

helper.pasrseJson=function(obj){
    try{
        var data=JSON.parse(obj);
        return data;
    }catch(e){
        console('Data can not be parsed');
        return {};
    }
}

helper.createRandomString=function(number){
    var strSize= typeof(number)=='number' ?number:false;
    if(strSize){
        var acceptableLetters='abcdefghijklmnopqrstuvwxyz1234567890';
        var tokenString='';
        for(i=0; i<strSize; i++){
            tokenString+=acceptableLetters.charAt(Math.random()*acceptableLetters.length);
        }
        return tokenString;
    }else{
        return false;
    }
}

module.exports=helper;


