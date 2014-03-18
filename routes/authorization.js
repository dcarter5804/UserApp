var PATH = '/authentication';

module.exports = function (server, passport) {
	server.get(PATH, function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if(user){
				res.type('text/json');
				res.send(200, user);
			}else{
				res.send(401, 'Unauthorized');
			}
			
		})(req, res, next);
	});

	server.post(PATH, function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if(user){
				res.type('text/json');
				res.send(200, user);
			}else{
				res.send(401, 'Unauthorized');
			}
			
		})(req, res, next);
	});
}