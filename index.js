var router = require('./routes/router');
var forward = require('./routes/forward');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

//访问的文件放在虚拟目录 static下
app.use('/static', express.static('public'));

app.use('/app', router);
app.use('/forward', forward);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('app listening at http://%s:%s', host, port);
});