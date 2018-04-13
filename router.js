var express = require('express');
var config = require('./config');
var router = express.Router();
var https = require('https');

//路由中间件
router.use(function timeLog(req, res, next) {
	console.log(`Logging start: originalUrl:      ${req.originalUrl}`);
	console.log(`Logging end:   Time:             ${new Date()}`);
	next();
});

router.get('/', function(req, res) {
	res.send('Hello World!');
});

router.get('/login', function(req, res) {

	var dataStr = (new Date()).valueOf();
	var path = "https://github.com/login/oauth/authorize";
	path += '?client_id=' + config.clientId;
	path += '&scope=' + 'user:email';
	path += '&state=' + dataStr;
	res.redirect(path);
	// res.redirect('/static/login.html');
});

router.get('/RegisteredByGithub', function(req, res) {
	var code = req.query.code;
	var state = req.query.state;
	var headers = req.headers;
	var path = "/login/oauth/access_token";
	headers.host = 'github.com';

	path += '?client_id=' + config.clientId;
	path += '&client_secret=' + config.clientSecret;
	path += '&code=' + code;

	var opts = {
		hostname: 'github.com',
		port: '443',
		path: path,
		headers: headers,
		method: 'POST'
	};
	var _res = res;
	var newReq = https.request(opts, function(newRes) {
		var token = '';
		newRes.setEncoding('utf8');

		newRes.on('data', function(data) {
			var args = data.split('&');
			var info = args[0].split("=");
			token = info[1];
		})

		newRes.on('end', function() {
			_res.send({
				code: 200,
				token: token,
				errMsg: '',
			});
		});

		newReq.on('error', function() {
			//此时 token 返回的是错误信息
			_res.send({
				code: 500125,
				token: token,
				errMsg: token,
			});
		})

	});

	newReq.end();
});

module.exports = router;