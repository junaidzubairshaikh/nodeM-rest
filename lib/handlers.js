
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
        _libs.read('users',phone,(err,data)=>{
            if(!err && data){
                delete data.password;
                callback(200,data);
            }else{
                callback(404);
            }
        })
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

}

handlers._token.post=function(data,callback){
    var phone=typeof(data.payload.phone)=='string' && data.payload.phone.length==10? data.payload.phone:false;
    var password=typeof(data.payload.password)=='string' && data.payload.password.length>0? data.payload.password:false;
    if(phone && password){

        _libs.read('tokens',phone,(err,userData)=>{
            if(!err && userData){
                    
            }else{

            }
        })
    }else {

    }
}

handlers._token.put=function(data,callback){

}

handlers._token.delete=function(data,callback){

}


handlers.helloHandler=function(data,callback){
    callback(406,{message:'Hi, This is Node master class'});
}

handlers.notFoundHandler=function(data,callback){
    callback(404);
}

module.exports=handlers;