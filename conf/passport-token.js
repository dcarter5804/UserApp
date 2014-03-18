var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function (passport, appUsers){

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
}