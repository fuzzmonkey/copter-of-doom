
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var drone = arDrone.createClient();

var io = SocketIO.listen(server);
io.sockets.on('connection', function(socket) {
	console.log('user connected');

	// do some stuff here
	socket.on('command', function(data) {
		var cmd = data.cmd,
			value = data.value;

		drone[cmd](value);
	});
});
