var server=require('./lib/server');
var worker=require('./lib/worker');

var app={};

app.init=function(){
    server.init();
    // worker.init();
}


app.init();

