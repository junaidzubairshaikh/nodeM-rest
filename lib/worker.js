const fs=require('fs');
const path=require('path');
const http=require('http');
const https=require('https');
const url=require('url');
const helper=require('./helpers');
const libs=require('./libs');

var worker={};

worker.gatherAllChecks=function(){
    libs.getAll('checks',(err,data)=>{
        if(!err){
            data.forEach(filename => {
                libs.read('checks',filename,(err,checkData)=>{
                    if(!err){
                        worker.validateCheckData(checkData);
                    }else{
                        console.log('not able to read check file',filename);
                    }
    
                })
            });
        }else{
            console.log('Error occured on reading check directory');
        }
    });
}

worker.validateCheckData=function(checkData){
    console.log(checkData);
}

worker.loop=function(){
    setInterval(()=>{
        worker.gatherAllChecks();
    },5*1000);
};

worker.init=function(){
    worker.gatherAllChecks();
    worker.loop();
}


module.exports=worker;