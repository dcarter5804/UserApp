'use strict';

angular.module('UserApp.addContactController', [
        'UserApp.userFactory',
        'UserApp.modalService'
    ])
	.controller('AddUserController', function ($scope, $location, ModalService, UserFactory) {
		var emptyUser = {
				first_name : '',
				last_name : '',
				title : '',
				description : ''
		};
		
		$scope.addUser = function () {
			
			// Set the $scope User object back to empty (very cool!!)
			var clearForm = function () {				
				$scope.User = emptyUser;
			};
				
			UserFactory.addUser({user : $scope.User})
				.success(function (user) {
					var modalOptions = {						
				            headerText: 'User Addition Confirmation:',
				            bodyText: 'User '+$scope.User.first_name + ' ' + $scope.User.last_name + ' has been successfully added.',
				            buttons : [
					   	                {
					   	                	text : 'Return Home',
					   	                	onClick :{
					   	                		action : function ($modalInstance) {
					   		                		$modalInstance.close();
													$location.path('/home');
					   		                	}
					   	                	}
					   	                },
										{
											text : 'Add Another User',
											onClick :{
					   	                		action : function ($modalInstance) {
					   	                			clearForm();				   	                			
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
		
	}
);