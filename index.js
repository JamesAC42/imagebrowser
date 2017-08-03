var http = require('http');
var fs = require('fs');
var path = require('path');
var pug = require('pug');
var url = require('url');

var valid_types = ['.jpg', '.png', '.gif'];

var server = http.createServer(function(req, res){
	if(req.method.toLowerCase() == "get"){
		respond(req, res);
	}
});

function respond(req, res){
	var p = __dirname + req.url;
	var ext = path.extname(p);
	fs.exists(p, function(exists){
		if(exists){
			if(ext == ''){
				fs.readdir(p, function(err, files){
					if(err) throw err;
					var images = files.filter(file => {
						return valid_types.indexOf(path.extname(file)) != -1;
					}).map(image => {
						return req.url + '/' + image;
					});
					var dirs = files.filter(file => {
						return fs.lstatSync(p + '/' + file).isDirectory() && file != "node_modules";
					}).map(dir => {
						return './' + dir;
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
			}else if(ext == ".jpg" || ext == ".png" || ext == ".gif"){
				let contentType = "";
				switch(ext){
					case ".jpg":
						contentType = "image/jpg";
						break;
					case ".png":
						contentType = "image/png";
						break;
					case ".gif":
						contentType = "image/gif";
						break;
					default:
						contentType = "text/plain";
						break
				}
				fs.readFile(p, function(err, data){
					res.writeHead(200, {"Content-type":contentType});
					res.end(data, 'binary');
				});
			}else{
				if(ext == '.css'){
					res.writeHead(200, {"Content-Type":"text/css"});
					fs.readFile(p, function(err, data){
						if(err) throw err;
						res.end(data);
					});
				}
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

server.listen(3434, "0.0.0.0");
console.log("Listening on 3434...");