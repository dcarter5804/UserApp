var localStrategy = require('passport-local');

module.exports = function (passport, appUsers) {
	/* Setup local Passport */
	passport.use(new localStrategy(function (username, password, done) {

		
		appUsers.find({username:username, password:password}).limit(1, function (err, user) {

			// If there was an error with the query
			if (err) { return done(err); }
			
			// If no user / password combination was found
			if (!user || user.length == 0) {
				return done(null, false, { message: 'Invalid Username or Password.' });
			}
			
			// success
			if(user.length == 1){
				var userObj = user[0];				
				
				// If the user doesn't have a token yet, create one and store it, then return done
				if(! userObj.token){
					
					// Create the token
					var token = jwt.encode(userObj, serverConf.secret );
					
					userObj.token = token;
					
					// Store the tokens
					appUsers.update({_id:userObj._id}, {$set : {token : userObj.token}}, function (err, success) {
						if(!err){
							return done(null, userObj);
						}
					});
				}
				
				// If there is already a token, return the user object
				else{
					return done(null, userObj);
				}
			}
		})
	}));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		appUsers.find({_id:id}).limit(1, function (err, success) {			
			// If there's no error, return the use
			if(! err){
				done(null, user[0]);
			}			
			// Else, return the error
			else{
				done(err, false);
			}
		})
	});
}