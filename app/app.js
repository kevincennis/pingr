// Config
var http = require('http'),
    url = require('url'),
    path = require('path'),
    static = require('node-static'),
    webroot = path.join(path.dirname(__filename), '../public'),
    index = '/index.html',
    file = new(static.Server)(webroot);
// Server
http.createServer(function(req, res){
    var uri = url.parse(req.url).pathname,
        filename = path.join(webroot, uri == '/' ? index : uri);
	path.exists(filename, function(exists){
        if (!exists){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end();
        } else {
            file.serve(req, res);
        }   
    }); 
}).listen(80);