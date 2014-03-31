module.exports = function (server, passport, users, mongodb) {
	/* User REST API */
	/* Handlers */


	function addPhoneNumber(req, res){
		res.type('text/json');
		
		var phoneNumber = req.body.phone_number;
		
		phoneNumber.id = mongodb.ObjectId();
				
		users.update(
			{_id:mongodb.ObjectId(req.params.userID)},
			{$push : {phone_numbers : phoneNumber} },
			function (err, success) {
				if(success){
					res.send(201 , phoneNumber);
				}else{
					res.statusCode = 404;
		            res.send('Error 404: Unable to add phone number');
				}
			}
		);
	}
	
	function deletePhoneNumber(req, res){
		res.type('text/json');
		
		var phoneNumber = req.body.phone_number;
		
		console.log("user id: ", req.params.userID);
		console.log("phonenumber id: ", req.params.phonenumberID);

				
		users.update(
			{_id:mongodb.ObjectId(req.params.userID)},
			{$pull : {phone_numbers : {id : mongodb.ObjectId(req.params.phonenumberID)}} },
			function (err, success) {
				if(success){
					res.send(201 , success);
				}else{
					res.statusCode = 404;
		            res.send('Error 404: Unable to delete phone number');
				}
			}
		);
	}
	
	function updatePhoneNumber(req, res){
		res.type('text/json');
		
		var phoneNumber = req.body.phone_number,
			id = phoneNumber.id;	
				
		phoneNumber.id = mongodb.ObjectId(id);
		
		users.update(
			{
				_id:mongodb.ObjectId(req.params.userID),
				phone_numbers : { 
					$elemMatch : { id : mongodb.ObjectId(id)}
				}
			},
			{
				$set : {
					"phone_numbers.$" : phoneNumber
				}
			},
			function (err, success) {
				if(success){
					res.send(201 , success);
				}else{
					res.statusCode = 404;
		            res.send('Error 404: Unable to update phone number');
				}
			}
		);
	}
	
	/* Listeners */
	var PATH = '/api/user/phonenumbers';
	server.post(PATH +'/:userID', addPhoneNumber);
	server.del(PATH +'/:userID/:phonenumberID', deletePhoneNumber);
	server.put(PATH +'/:userID', updatePhoneNumber);
}