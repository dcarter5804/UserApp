/* Include Modules */
var express = require('express');
var mongodb = require('mongojs');
var passport = require('passport');
var jwt = require('jwt-simple');
var ENV = 'dev';

/* Config Files */
var dbConf = require('./conf/database.js')(ENV);
var serverConf = require('./conf/server.js')[ENV];

/* Initialize Server */
var server = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Call the next handler
    next();
}

/* Create MongoDB Connection */
var dbh = mongodb(dbConf.connectionString, [dbConf.database]);
var users = dbh.collection("users");
var appUsers = dbh.collection("app_users");

/* Initialize local authorization */
var localPassport = require('./conf/passport-local.js')(passport, appUsers);

/* Initialize token based authentication */
var tokenPassport = require('./conf/passport-token.js')(passport, appUsers);

/* Configure server modules */
//app.use(express.static('public'));
server.use(express.cookieParser());
server.use(express.bodyParser());
server.use(express.json());
server.use(express.methodOverride());
server.use(express.urlencoded());
server.use(express.session({ secret: '12345' }));
server.use(passport.initialize());
server.use(passport.session());
server.use(allowCrossDomain);
server.use(server.router);

server.use(express.static(__dirname + '/webroot'));

//server.use(app.router);
var userRoutes = require('./routes/users.js');
userRoutes(server, passport, users);




var PATH2 = '/authentication';
server.get(PATH2, function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if(user){
				res.type('text/json');
				res.send(200, user);
			}else{
				res.send(401, 'Unauthorized');
			}
			
		})(req, res, next);
	}
);

server.post(PATH2, function (req, res, next){
	passport.authenticate('local', function (err, user, info) {
		if(user){
			res.type('text/json');
			res.send(200, user);
		}else{
			res.send(401, 'Unauthorized');
		}
		
	})(req, res, next);
}
);

/* Set server to listen */
server.listen(serverConf.port, function () {
	console.log("Server is listening on: "+ serverConf.host+" a port:" + serverConf.port);
});