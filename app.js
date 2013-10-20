
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');

var SocketIO = require('socket.io');

var exphbs = require('express3-handlebars');
var assets = require('connect-assets');

var arDrone = require('ar-drone');
var PaVEParser = require('ar-drone/lib/video/PaVEParser');
// var dronestream = require('dronestream');

var app = express();

var hbsHelpers = {},
	hbs = exphbs.create({
		helpers: hbsHelpers,
		defaultLayout: 'main'
	});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(assets({
	helperContext: hbsHelpers,
	src: path.join(__dirname, 'public')
}));
hbsHelpers.js.root = 'javascripts';

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var lastPng;
app.get('/', routes.index);
app.get('/image', function(req, res) {
	if (!lastPng) {
		res.writeHead(503);
		res.end('Did not receive any png data yet.');
		return;
	}

	res.writeHead(200, {'Content-Type': 'image/png'});
	res.end(lastPng);
});
// app.get('/video', function(req, res) {
// 	video.browser(req, res);
// });

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var drone = arDrone.createClient({
	imageSize: '960x540',
	frameRate: 10
});
var io = SocketIO.listen(server, {
	log: false
});

// dronestream.listen(server);

var customCommands = {
	takePicture: function(value, socket) {
		var stream = drone.getPngStream();
		stream.on('data', function(data) {
			try {
				lastPng = data;
			} catch(e) {
				console.log('error');
			}
		});
	}
};

var commandLength = 100,
	doCommand = _.throttle(function (cmd, value, socket) {
		console.log('told drone to ', cmd, ' with value ', value);
		if (cmd in drone) {
			drone[cmd](value);
		} else {
			customCommands[cmd](value, socket);
		}
	}, commandLength);

io.sockets.on('connection', function(socket) {
	console.log('user connected');

	socket.emit('navdata', { altitudeMeters: 'no nav data', batteryPercent: 'n/a' });

	drone.on('navdata', function(navdata) {
		socket.emit('navdata', { altitudeMeters: navdata.demo.altitudeMeters, batteryPercent: navdata.demo.batteryPercentage });
	});

	// do some stuff here
	socket.on('command', function(data) {
		doCommand(data.cmd, data.value, socket);
	});
});

// function video() {
// 	var parser = new PaVEParser(),
// 		video = drone.getVideoStream();
// 	
// 	video.pipe(parser);
// 
// 	return parser;
// }
// 
// video.browser = function(req, res) {
// 	var stream = video();
// 
// 	res.writeHead(200, {
// 		'Content-Type': 'video/h264',
// 		'Transfer-Encoding': 'chunked'
// 	});
// 
// 	stream.on('data', function(data) {
// 		setImmediate(function() {
// 			console.log('got data');
// 			res.write(data.payload);
// 		});
// 	}).on('error', function() {
// 		res.end();
// 	});
// };
