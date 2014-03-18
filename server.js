/* Include Modules */
var express = require('express');
var mongodb = require('mongojs');
var passport = require('passport');
var localStrategy = require('passport-local');
var BearerStrategy = require('passport-http-bearer').Strategy;
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

/* Setup local Passport */
passport.use(new localStrategy(function (username, password, done) {
	console.log("username: " + username);
	console.log("password: " + password);
	
	appUsers.find({username:username, password:password}).limit(1, function (err, user) {
		if(user){
			console.log("find user: " + JSON.stringify(user));	
		}else{
			console.log("No User Found");
		}
		// If there was an error with the query
		if (err || user.length == 0) { return done(err); }
		
		// If no user / password combination was found
		if (!user) {
			return done(null, false, { message: 'Invalid Username or Password.' });
		}
		
		// success
		if(user.length == 1){
			var userObj = user[0];				
			
			// If the user doesn't have a token yet, create one and store it, then return done
			if(! userObj.token){
				
				var token = jwt.encode(userObj, serverConf.secret );
				
				userObj.token = token;
				
				appUsers.update({_id:userObj._id}, {$set : {token : userObj.token}}, function (err, success) {
					if(!err){
						return done(null, userObj);
					}
				});
			}
			else{
				return done(null, userObj);
			}
		}
	})
}));

passport.serializeUser(function(user, done) {
	console.log("serialize user: ", JSON.stringify(user));
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("id: ", id);
	appUsers.find({_id:id}).limit(1, function (err, success) {
		if(! err){
			done(err, user[0]);
		}else{
			done(err, false);
		}
	})
});

/* Set up Token Passport */
passport.use(
	new BearerStrategy(
		{},
		function (token, done) {
			console.log("token: " + token);
			
			appUsers.find({token:token}, function (err, success) {
				console.log("err: " + err);
				console.log("success: " + success);
				if(success.length && success.length > 0){
					return done(null, {something:'something'});
				}else{
					return done(null, false);
				}
			});						
		}
	)
);



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

/* User REST API */
/* Handlers */
function findAllUsers(req, res){
	res.type('text/json');
	
	users.find().limit(25).sort([['last_name','ascending'],['first_name', 'ascending']], function (err , success) {
    	if(success){
    		res.send(200 , success);
        }else{
        	res.statusCode = 404;
            res.send('Error 404: No users found');
        }
    });
}

function findUser(req, res){
	res.type('text/json');
	
	users.find({_id:mongodb.ObjectId(req.params.userID)}, function (err, success) {
		if(success){
			res.send(200, success[0]);
		}else{
			res.statusCode = 404;
            res.send('Error 404: User Not Found');
		}
	});
}

function addUser(req, res){
	res.type('text/json');
	
	var newUser = req.body.user;
			
	users.save(newUser , function(err , success){
        if(success){
        	res.send(201 , newUser);            
        }else{
        	res.statusCode = 404;
            res.send('Error 404: Unable to add user');
        }
    });
}

function updateUser(req, res){
	res.type('text/json');
	
	var udpatedUser = req.body.user;
	
	// Cannot update this field (its an indexed key)
	delete udpatedUser['_id'];
		
	users.update({_id:mongodb.ObjectId(req.params.userID)},{$set:udpatedUser}, function (err, success) {
		if(success){
			res.send(201 , success);
		}else{
			res.statusCode = 404;
            res.send('Error 404: Unable to update user');
		}
	});
};

function deleteUser(req, res){
	res.type('text/json');
	
	users.remove({_id:mongodb.ObjectId(req.params.userID)} , function(err , success){
        if(success){
        	res.send(204);
        } else{
        	res.statusCode = 404;
            res.send('Error 404: Unable to delete user');
        }
    })
}

/* Listeners */
var PATH = '/api/user';
server.get(PATH , passport.authenticate('bearer', { session: false }), findAllUsers);
server.get(PATH +'/:userID', findUser);
server.post(PATH , addUser);
server.put(PATH +'/:userID', updateUser);
server.del(PATH +'/:userID', deleteUser);



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