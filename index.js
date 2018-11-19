const http=require('http');
const url=require('url');
const StringDecoder=require('string_decoder').StringDecoder;
const environment=require('./config');


const server=http.createServer(function(req,res){

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
            'methods':req.method,
            'payload':buffer
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

   

    // console.log('hello world js',trimmedPath);
});


server.listen(environment.port,(req,res)=>{
console.log('The server is listening to port ',environment.port);
});

var handlers={};

handlers.sampleHandler=function(data,callback){
    callback(406,data);
}

handlers.notFoundHandler=function(data,callback){
    callback(404, 'Not found');
}

const router={
    sample:handlers.sampleHandler
}