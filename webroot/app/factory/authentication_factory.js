'use strict';

angular.module('UserApp.authenticationFactory', [])
	.factory('AuthenticationFactory', function ($http) {
		var factory = {};
		
		var RESTFUL = {
				host : 'http://68.178.129.69',
				port : '8888',
				apiPath : '/authentication'
			};
		
		factory.authenticateUser = function (user) {
			return $http.post(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath, user);
		};
		
		return factory;
	});