var localStrategy = require('passport-local');

module.exports = function (passport, appUsers) {
	/* Setup local Passport */
	passport.use(new localStrategy(function (username, password, done) {

		
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
}