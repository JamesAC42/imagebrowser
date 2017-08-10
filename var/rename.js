var fs = require('fs');
var path = require('path');

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

const _IGNORE = [];
const _VALID = ['.jpg','.png','.gif','.webm'];

var p = "C:/Users/james/pictures/reaction/";
var fileSys = {};
var dirs = getDirectories(p).filter(item=>{return(_IGNORE.indexOf(item) == -1)});

dirs.forEach(function(item, index){
	var p = "C:/Users/james/pictures/reaction/" + item;
	fs.readdir(p, (err, files) => {
		if (err) {
			throw err;
		}
		var pictures = files.map(file => {
			return (_VALID.indexOf(path.extname(file)) != -1) ? file : '';
		}).filter(file => {
			return file !== '';
		});
		pictures.forEach(function(item, index){
			let filepath = p + '/' + item;
			let newname = item.replace(/\s+/g,'-')
			newname = newname.replace(/[^a-zA-Z0-9\-.]/g,'-');
			let newpath = p + '/' + newname;
			fs.rename(filepath, newpath, function(err){
				if(err){
					console.error(err);
				}
			});
		});
	});
});

