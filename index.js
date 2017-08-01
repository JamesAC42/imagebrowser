var http = require('http');
var fs = require('fs');
var path = require('path');
var pug = require('pug');
var url = require('url');

var server = http.createServer(function(req, res){
	if(req.method.toLowerCase() == "get"){
		respond(req, res);
	}
});

function respond(req, res){
	console.log(req.url);
	var p = __dirname + req.url;
	var ext = path.extname(p);
	fs.exists(p, function(exists){
		if(exists){
			if(ext == ''){
				fs.readdir(p, function(err, files){
					if(err) throw err;
					var images = files.filter(file => {
						return path.extname(file) == ".jpg" || path.extname(file) == ".png";
					});
					var dirs = files.filter(file => {
						return fs.lstatSync(p + '/' + file).isDirectory();
					});
					var data = {
						'title':req.url,
						images,
						dirs
					};
					var render = pug.renderFile("index.pug", data);
					res.writeHead(200, {"Content-Type":"text/html"});
					res.end(render);
				});
			}else if(ext == ".jpg" || ext == ".png"){
				fs.readFile(p, function(err, data){
					res.writeHead(200, {"Content-type":"image/jpg"});
					res.end(data, 'binary');
				});
			}else{
				res.writeHead(200, {"Content-Type":"text/plain"});
				res.end("invalid");
			}
		}else{
			res.writeHead(200, {"Content-Type":"text/html"});
			fs.readFile("404.html",function(err, data){
				if(err)throw err;
				res.end(data, 'utf-8');
			});
		}
	});
}

server.listen(3434);
console.log("Listening on 3434");