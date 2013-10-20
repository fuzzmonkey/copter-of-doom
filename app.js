
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

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var drone = arDrone.createClient();

var io = SocketIO.listen(server, {
	log: false
});

var commandLength = 100,
	doCommand = _.throttle(function (cmd, value, socket) {
		console.log('told drone to ', cmd, ' with value ', value);
		drone[cmd](value);
	}, commandLength);

io.sockets.on('connection', function(socket) {
	console.log('user connected');

	// do some stuff here
	socket.on('command', function(data) {
		doCommand(data.cmd, data.value, socket);
	});
});

var STREAM_SECRET = 'test',
	STREAM_PORT = 8082,
	WEBSOCKET_PORT = 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 640,
    height = 360;
//
// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		this.clients[i].send(data, opts);
	}
};


// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');
	width = (params[1] || 320)|0;
	height = (params[2] || 240)|0;

	if( params[0] == STREAM_SECRET ) {
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress + 
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT);

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');
console.log('Examples:');
console.log('ffmpeg -i tcp://192.168.1.1:5555 -f mpeg1video -b 0 -b:v 800k -r 30 http://127.0.0.1:'+STREAM_PORT+'/test/640/360/');
