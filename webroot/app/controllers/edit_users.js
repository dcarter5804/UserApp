'use strict';

angular.module('UserApp.editContactController', [
        'UserApp.userFactory',
        'UserApp.modalService'
    ])
	.controller('EditUserController', function ($scope, $routeParams, $location, UserFactory, ModalService) {
		
		// Gets the user from the server (redundant)
		var getUser = function(){
			UserFactory.getUser($routeParams.userId)
	            .success(function (user) {
	                $scope.User = user;
	            })
	            .error(function (error) {
	                $scope.status = 'Unable to retrieve the user with id: ' + $routeParams.userId;
	            });
		};
		
		// Get the user from the server
		// TODO: Would it be safe to just take the user from the $scope.Users object?
		getUser();
		
		// Update Click Handler
		$scope.updateUser = function (){
			
			// Call the updateUser function with the updated user info
			UserFactory.updateUser({user : $scope.User})
	            .success(function (user) {	            
	            	// If it works, open a modal indicating it works with some options
	                var modalOptions = {						
				            headerText: 'User Update Confirmation:',
				            bodyText: 'User '+$scope.User.first_name + ' ' + $scope.User.last_name + ' has been successfully updated.',
				            buttons : [
					   	                {
					   	                	text : 'Return Home',
					   	                	'class' : 'btn-primary',
					   	                	onClick :{
					   	                		action : function ($modalInstance) {
					   		                		$modalInstance.close();
													$location.path('/home');
					   		                	}
					   	                	}
					   	                },
					   	                {
					   	                	text : 'Continue Editing',
					   	                	'class' : 'btn-primary',
					   	                	onClick : {
					   	                		action : function ($modalInstance) {
					   	                			$modalInstance.close();
					   	                		}
					   	                	}
					   	                }
					   	            ]
				    };
					ModalService.showModal({}, modalOptions);	                
	            })
	            .error(function (error) {
	            	// Handle the error
	            	// TODO: Actually do something here
	            });								
		};
		
		// Delete a user based on ID
		$scope.deleteUser = function () {
			
			// Pop the modal to make sure the user wants to delete
			// TODO: put this in a function
			var modalOptions = {						
		            headerText: 'User Deletion Confirmation:',
		            bodyText: 'Are you sure you want to delete user: '+$scope.User.first_name + ' ' + $scope.User.last_name + '?',
		            buttons : [
			   	                {
			   	                	text : 'Yes',
			   	                	'class' : 'btn-success',
			   	                	onClick :{
			   	                		action : function ($modalInstance) {
			   		                		$modalInstance.close();
			   		                		
			   		                		// Do the delete call
			   		                		UserFactory.deleteUser($scope.User._id)
					   		     				.success(function () {
					   		     					// Pop the delete confirmation message
					   		     					// TODO: Put this in a separate function
						   		     				var modalOptions = {
						   		     					headerText : 'User Deletion Confirmation',
						   		     					bodyText : 'The User: '+$scope.User.first_name+' '+$scope.User.last_name+' has been deleted.',
						   		     					buttons : [
						   		     					    {
						   		     					    	text : 'OK',
						   		     					    	onClick : {
						   		     					    		action : function ($modalInstance) {
						   		     					    			$modalInstance.close();
						   		     	   		                		$location.path('/home');
						   		     					    		}
						   		     					    	}
						   		     					    }
						   		     					]
						   		     				};
						   		     				
						   		     				// Open the Modal
						   		     				ModalService.showModal({}, modalOptions);					   		     			
					   		     				})
					   		     				.error(function () {
					   		     					// Handle the error
					   		     	            	// TODO: Actually do something here
					   		     				});			   		                		
			   		                	}
			   	                	}
			   	                },
			   	                {
			   	                	text : 'No',
			   	                	'class' : 'btn-danger',
			   	                	onClick :{
			   	                		action : function ($modalInstance) {
			   		                		$modalInstance.close();											
			   		                	}
			   	                	}
			   	                },
			   	            ]
		    };
			// Open the modal
			ModalService.showModal({}, modalOptions);
		}
});
