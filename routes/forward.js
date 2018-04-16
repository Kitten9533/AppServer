var express = require('express');
var config = require('../config');
var router = express.Router();
var request = require('request');
var logger = require('../logger');

var host = 'https://api.github.com';
//路由中间件
router.use(function timeLog(req, res, next) {
	logger.info(`originalUrl:${req.originalUrl}, forwarding to ${host + req.url}`);
	next();
});

router.all('*', function(req, res) {
	var url = req.url || '';
	if (!url) {
		logger.error('forwarding url must not be null');
	}
	var method = req.method.toLowerCase();
	var originalUrl = req.originalUrl;
	req.pipe(request[method](`${host + url}`, {
		json: true,
		body: req.body,
		headers: {
			'Accept': 'application/vnd.github.mercy-preview+json',
		},
	}), {
		end: false
	}).on('error', function(err) {
		logger.error(`Error in forwarding ${originalUrl}, medthod ${method}`);
	}).pipe(res);
});

const forward = router;

module.exports = forward;