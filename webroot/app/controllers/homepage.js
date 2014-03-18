'use strict';

angular.module('UserApp.homepageController', [
        'UserApp.userFactory'
	])
	.controller('HomePageUsersController', function ($scope, UserFactory) {
		
		var getInitialUsers = function () {
			UserFactory.getUsers()
	            .success(function (users) {
	                $scope.Users = users;
	            })
	            .error(function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	            });
		}
		
		getInitialUsers();
});