
var fs=require('fs'); 
var path=require('path');
var helper=require('./helpers');

var libs={};
var baseDir=path.join(__dirname,'/../.data/');

libs.create=function(dir,file,data,callback){
    if(!fs.existsSync(baseDir+dir)){
        fs.mkdirSync(baseDir+dir);
    }   
    
    var absolutePath=baseDir+dir+'/'+file+'.json';

    fs.open(baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
            if(!err && fileDescriptor){

                var stringData=JSON.stringify(data);
                fs.write(fileDescriptor,stringData,(err)=>{
                     if(!err){
                        fs.close(fileDescriptor,(err)=>{
                            if(!err){
                                callback(false,'File created '+file )
                            }else{
                                callback(true);
                            }
                        });
                     }else{
                         callback(true);
                     }   
                });
            }else{
                callback(true);
            }
    });
}


libs.update=function(dir,file,data,callback){
    var path=baseDir+dir+'/'+file+'.json';

    fs.open(path,'r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            var stringData=JSON.stringify(data);
            
            fs.truncate(path,(err)=>{
                if(!err){
                    fs.write(fileDescriptor,stringData,(err)=>{
                            if(!err){
                                fs.close(fileDescriptor,(err)=>{
                                    if(!err){
                                          callback(false,'Data updated successfully');      
                                    }else{
                                        callback(true)
                                    }
                                })    
                            }else{
                                callback(true)
                            }
                    });    
                }else{
                    callback(true);
                }
            });
        }else{
            callback('error in opening file')
        }
    });
}

libs.read=function(dir,file,callback){
fs.readFile(baseDir+dir+'/'+file+'.json','utf-8',(err,data)=>{
    if(!err){
        var parsedData=helper.pasrseJson(data);
        callback(false,parsedData);
    }else{
        callback(true);
    }
});
}


libs.delete=function(dir,file,callback){
    fs.unlink(baseDir+dir+'/'+file+'.json',(err)=>{
        if(!err){
            callback(false,'file deleted');
        }else{
            callback(true,'Error in deleting file');
        }
    });
}

module.exports=libs;