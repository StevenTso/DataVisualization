var express = require('express')
  , http = require('http')
  , path = require('path')
  , socket_io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//// WebSocket ////
var io  = socket_io.listen(server, { log : true });

var Parse = require('node-parse-api').Parse;
var APP_ID = PARSE_APP_ID;
var MASTER_KEY = PARSE_MASTER_KEY;
var parse_app = new Parse(APP_ID, MASTER_KEY);


server.listen(process.env.PORT || 5000);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//var data = new Array();

io.sockets.on('connection', function (socket) {
	//step 2 (signal to refresh page)
	socket.on('updateServer', function() {
		console.log("updatingServer");
		//grab latest entry from database and push data
		parse_app.find('handshake', { 'foo' : 'bar' }, function (err, response) {
		//parse_app.find('Visuation', { 'foo' : 'bar' }, function (err, response) {
  			io.sockets.emit('updatePage', response);
		});
	});
});