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

module.exports=helper;


