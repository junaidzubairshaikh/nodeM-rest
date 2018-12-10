var crypto=require('crypto');
var config=require('../config');
var https=require('https');
var querystring=require('querystring');

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
        console.log('Data can not be parsed');
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

helper.sendTwilioMsg=function(phone,msg,callback){
    phone=typeof(phone)=='string' && phone.length==10?phone:false;
    msg=typeof(msg)=='string' && msg.length>0 && msg.length<=1000?msg.trim():false;
    if(phone && msg){
        var payload={
            'From':config.twilio.from,
            'To':'+92'+phone,
            'Body':msg
        };

        var stringPayload=querystring.stringify(payload);
        var requestObj={
            'protocol':'https:',
            'hostname':'api.twilio.com',
            'method':'POST',
            'path':'2010-04-01/Accounts/'+config.twilio.accoundSid+'/Messages.json',
            'auth':config.twilio.accoundSid+':'+config.twilio.authToken,
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length':Buffer.byteLength(stringPayload)
            }
        }
        var req=https.request(requestObj,(res)=>{
            var status=res.statusCode;
            if(status ==200 || status==201){
                callback(false);
            }else{
                callback('Status code returned was '+ res.statusCode);
            }
        });
         
        req.on('error',(e)=>{
            callback(e);
        });

        req.write(stringPayload);
        req.end();
    }
}

module.exports=helper;


