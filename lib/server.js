const http=require('http');
const https=require('https');
const url=require('url');
const fs=require('fs');
const StringDecoder=require('string_decoder').StringDecoder;
const environment=require('../config');
const libs=require('./libs');
const handlers=require('./handlers');
const helper=require('./helpers');


//Create a file
// libs.create('test','newFile',{'hello':'world'},function(err){
//         console.log(err);
// });

//read file

// libs.read('test','newFile',(data)=>{
//  console.log('Reading file...',data)
// });

// libs.update('test','newFile',{'key':'hello world'},(msg)=>{
//     console.log(msg);
// });

// libs.delete('test','newFile',(msg)=>{
//     console.log(msg);
// })

var server={};
server.httpsServerOption={
    key:fs.readFileSync('./https/key.pem'),
    cert:fs.readFileSync('./https/cert.pem')
}

server.httpServer=http.createServer(function(req,res){
    server.unifiedServer(req,res);
});

server.httpsServer=https.createServer(server.httpsServerOption,function(req,res){
    server.unifiedServer(req,res);
});

server.unifiedServer=function(req,res){
    var parsedUrl=url.parse(req.url,true);
  
    var trimmedPath=parsedUrl.pathname.replace(/^\/+|\+$/g,'');

    var decoder=new StringDecoder("utf-8");
    var buffer='';
    req.on('data',function(data){
        buffer+=decoder.write(data);
    });

    req.on('end',function(){
        buffer+=decoder.end();

        var routerResolver=typeof(server.router[trimmedPath])!=='undefined'?server.router[trimmedPath]:handlers.notFoundHandler;

        var data={
            'trimmedPath':trimmedPath,
            'query':parsedUrl.query,
            'headers':req.headers,
            'method':req.method.toLowerCase(),
            'payload':helper.pasrseJson(buffer)
        }
        routerResolver(data,function(statusCode,payload){
            statusCode=typeof(statusCode)=='number'?statusCode:200;
            payload=typeof(payload)=='object'?payload:{};
            res.setHeader('Content-Type','application\json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
                console.log('Resolver with status code '+statusCode,'with data ',payload);
        });

    });
}

server.router={
    hello:handlers.helloHandler,
    users:handlers.users,
    tokens:handlers.token,
    checks:handlers.checks
}

server.init=function(){

    helper.sendTwilioMsg('3363633911','Hi',(msg)=>{
        console.log('Message from callback',msg);
    })
    server.httpServer.listen(environment.httpPort,(req,res)=>{
        console.log('The server is listening on port ',environment.httpPort);
    });
    
    server.httpsServer.listen(environment.httpsPort,(req,res)=>{
        console.log('The server is listening on port', environment.httpsPort)
    });
}

module.exports=server;