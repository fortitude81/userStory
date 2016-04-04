var   express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, morgan = require('morgan')
	, config = require('./config')
	, mongoose = require('mongoose')
	, port = 3000;
	
var http = require('http').Server(app);
var io = require('socket.io')(http);

//middlewares
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public')); //middleware render public files

var api = require('./app/routes/api')(app, express, io);  //calling express from api.js
app.use('/api', api);

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});
// app.use(cors());

// mongoose.connect(mongoUri);
mongoose.connect(config.database, function() {
	console.log('Connected to damn database ');
});


http.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Listening on ' + port);
	}
});



