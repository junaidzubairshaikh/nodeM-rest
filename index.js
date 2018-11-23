const http=require('http');
const https=require('https');
const url=require('url');
const fs=require('fs');
const StringDecoder=require('string_decoder').StringDecoder;
const environment=require('./config');
const libs=require('./lib/libs');
const handlers=require('./lib/handlers');
const helper=require('./lib/helpers');


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


const httpsServerOption={
    key:fs.readFileSync('./https/key.pem'),
    cert:fs.readFileSync('./https/cert.pem')
}

const httpServer=http.createServer(function(req,res){
    unifiedServer(req,res);
});

httpServer.listen(environment.httpPort,(req,res)=>{
    console.log('The server is listening on port ',environment.httpPort);
});

const httpsServer=https.createServer(httpsServerOption,function(req,res){
    unifiedServer(req,res);
});

httpsServer.listen(environment.httpsPort,(req,res)=>{
    console.log('The server is listening on port', environment.httpsPort)
});

var unifiedServer=function(req,res){
    var parsedUrl=url.parse(req.url,true);
  
    var trimmedPath=parsedUrl.pathname.replace(/^\/+|\+$/g,'');

    var decoder=new StringDecoder("utf-8");
    var buffer='';
    req.on('data',function(data){
        buffer+=decoder.write(data);
    });

    req.on('end',function(){
        buffer+=decoder.end();

        var routerResolver=typeof(router[trimmedPath])!=='undefined'?router[trimmedPath]:handlers.notFoundHandler;

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

const router={
    hello:handlers.helloHandler,
    users:handlers.users,
    tokens:handlers.token
}