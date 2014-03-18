'use strict'

 angular.module('UserApp.loginController', [
        'UserApp.authenticationFactory',
        'UserApp.modalService',
        'UserApp.cookieFactory'
    ])
	.controller('LoginController', function ($scope, AuthenticationFactory, ModalService, $location, CookieFactory){
		
		$scope.submit = function(){
			AuthenticationFactory.authenticateUser($scope.App.user)
				.success(function (userData) {
					CookieFactory.setCookie("token", userData.token);
					
					$location.path('/home');
				})
				.error(function () {
					var modalOptions = {
							headerText: 'Authentication Error:',
				            bodyText: 'Invalid username and password.  Please enter a valid username and password.',
				            buttons : [					   	               
										{
											text : 'OK',
											onClick :{
					   	                		action : function ($modalInstance) {
					   		                		$modalInstance.close();												
					   		                	}
					   	                	}
										}
					   	            ]
						};
					ModalService.showModal({}, modalOptions);	
				});
		};
		
	});