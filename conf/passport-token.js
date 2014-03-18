var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function (passport, appUsers){

	passport.use(
		new BearerStrategy(
			{},
			function (token, done) {
				
				appUsers.find({token:token}, function (err, success) {
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