
var _libs=require('./libs');
var helper=require('./helpers');
var handlers={};



handlers.users=function(data,callback){
    var acceptableMethods=['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._user[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._user={};

//firstname, lastname, password,phone, tosAgreement
handlers._user.post=function(data,callback){
    var firstname=typeof(data.payload.firstname)=='string' && data.payload.firstname.length>0? data.payload.firstname:false;
    var lastname=typeof(data.payload.lastname)=='string' && data.payload.lastname.length>0? data.payload.lastname:false;
    var phone=typeof(data.payload.phone)=='string' && data.payload.phone.length===10? data.payload.phone:false;
    var password=typeof(data.payload.password)=='string' && data.payload.password.length>0? data.payload.password:false;
    var tosAgreement=typeof(data.payload.tosAgreement)=='boolean' && data.payload.tosAgreement==true? true:false;


    if(firstname && lastname && phone && password && tosAgreement){
        _libs.read('users',phone,(err)=>{
            if(err){
                var hashedPassword=helper.hashPassword(password);

               if(hashedPassword){
                var user={
                    firstname:firstname,
                    lastname:lastname,
                    password:hashedPassword,
                    phone:phone,
                    tosAgreement:true,
                    createdTime:Date.now().toString()
                }
                _libs.create('users',phone,user,(err)=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'Error':'Error creating user'});
                    }
                })
               }else{
                   callback(500,{'Error':'Password not be hashed'});
               }
                
            }else{
                callback(400,{'Error':'User already exist'});
            }
        });

    }else{
        callback(400,{'Error':'Missing Field'});
    }

}

handlers._user.put=function(data,callback){
    var firstname=typeof(data.payload.firstname)=='string' && data.payload.firstname.length>0? data.payload.firstname:false;
    var lastname=typeof(data.payload.lastname)=='string' && data.payload.lastname.length>0? data.payload.lastname:false;
    var phone=typeof(data.payload.phone)=='string' && data.payload.phone.length===10? data.payload.phone:false;
    var password=typeof(data.payload.password)=='string' && data.payload.password.length>0? data.payload.password:false;

    if(phone){
        if(firstname  || lastname || password){
            _libs.read('users',phone,(err,userData)=>{
                if(!err && userData){
                    if(firstname){
                        userData.firstname=firstname;
                    }
                    if(lastname){
                        userData.lastname=lastname;
                    }
                    if(password){
                        userData.password=password;
                    }

                    _libs.update('users',phone,userData,(err,data)=>{
                           if(!err){
                               callback(200);
                           } else{
                               callback(500,{'Error':'Something bad happens'});
                           }
                    });
                }else{
                    callback(404);
                }
            })
        }else{
            callback(400,{'Error':'Missing specified fields'});
        }

    }else{
        callback(400, {'Error':'Missing required field'});
    }
}

handlers._user.get=function(data,callback){
    var phone=typeof(data.query.phone)=='string' && data.query.phone.length==10?data.query.phone:false;
    if(phone){

        var token=data.headers.token;
        handlers._token.verify(phone,token,(data)=>{
            if(data){
                _libs.read('users',phone,(err,data)=>{
                    if(!err && data){
                        delete data.password;
                        callback(200,data);
                    }else{
                        callback(404);
                    }
                })
            }else{
                callback(403, {'Error':'Token is expired or something bad happend with your token'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required field'});
    }
}

handlers._user.delete=function(data,callback){

    var phone=typeof(data.query.phone)=='string' && data.query.phone.length==10?data.query.phone:false;
    if(phone){
        _libs.read('users',phone,(err,data)=>{
            if(!err && data){
                _libs.delete('users',phone,(err)=>{
                        if(!err){
                            callback(200,{'Message':'User deleted successfully'});
                        }else{
                            callback(500)
                        }
                })
            }else{
                callback(400, {'Errror':'User does not exist'});
            }
        })
    }else{
        callback(400,{'Error': 'Missing required filed'});
    }
}


handlers.token=function(data,callback){
    var acceptableMethods=['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._token[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._token={};


handlers._token.get=function(data,callback){
    var tokenId=typeof(data.query.id)=='string' & data.query.id.length==20 ?data.query.id.trim():false;
    if(tokenId){
        _libs.read('token',tokenId,(err,tokenData)=>{
            if(!err && tokenData){
                callback(200,tokenData)
            }else{
                callback(500);
            }
        });
    }else{
        callback(400,{'Error':'Missing required field'});
    }
}

handlers._token.post=function(data,callback){
    var phone=typeof(data.payload.phone)=='string' && data.payload.phone.length==10? data.payload.phone:false;
    var password=typeof(data.payload.password)=='string' && data.payload.password.length>0? data.payload.password:false;
    if(phone && password){

        _libs.read('users',phone,(err,userData)=>{
            if(!err && userData){
                    
                var hashedPass=helper.hashPassword(password);
                if(userData.password==hashedPass){
                    var token=helper.createRandomString(20);
                    if(token){
                        var expires=Date.now()+1000*60*60;
                        var tokenData={
                            phone:phone,
                            id:token,
                            expires:expires
                        }
                        _libs.create('token',token,tokenData,(err,data)=>{
                            if(!err){
                                callback(200,tokenData);
                            }else{
                                callback(500);
                            }
                        });
                    }
                }
            }else{
                callback(400,{'Error':'Could not find the specified user'});
            }
        })
    }else {
        callback(400,{'Error':'Missing required fields'});
    }
}

handlers._token.put=function(data,callback){
    var tokenId=typeof(data.payload.id)=='string' & data.payload.id.length==20 ?data.payload.id.trim():false;
    var extend=typeof(data.payload.extend)=='boolean' & data.payload.extend==true ?true:false;
    if(tokenId && extend){
        _libs.read('token',tokenId,(err,tokenData)=>{
            if(!err && tokenData){
                if(tokenData.expires>Date.now()){
                    tokenData.expires=Date.now()+1000*3*60;

                    _libs.update('token',tokenId,tokenData,(err,data)=>{
                        if(!err){
                            callback(200,data);
                        }else{
                            callback(500);
                        }
                    })
                }else{
                    callback(400,{'Error':'Token expires'});
                }
            }else{
                callback(500, {'Error':'No token found'});
            }
        })
    }else{
        callback(400, {'Error':'Missing required fields'});
    }
}

handlers._token.delete=function(data,callback){
    var tokenId=typeof(data.query.id)=='string' && data.query.id.length==20?data.query.id:false;
    if(tokenId){
        _libs.read('token',tokenId,(err,data)=>{
            if(!err && data){
                _libs.delete('token',tokenId,(err)=>{
                        if(!err){
                            callback(200,{'Message':'Token deleted successfully'});
                        }else{
                            callback(500)
                        }
                })
            }else{
                callback(400, {'Errror':'Token does not exist'});
            }
        })
    }else{
        callback(400,{'Error': 'Missing required filed'});
    }
}

handlers._token.verify=function(phone,tokenId,callback){
    var phone =typeof(phone)=='string'?phone:'';
    if(phone){
        _libs.read('token',tokenId,(err,tokenData)=>{
            if(!err && tokenData){
                if(tokenData.phone==phone && tokenData.expires>Date.now()){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        });
    }
}


handlers.helloHandler=function(data,callback){
    callback(406,{message:'Hi, This is Node master class'});
}

handlers.notFoundHandler=function(data,callback){
    callback(404);
}

module.exports=handlers;