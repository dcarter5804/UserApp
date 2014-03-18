module.exports = function (server, passport, users, mongodb) {
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
}