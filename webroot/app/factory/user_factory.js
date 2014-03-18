'use strict';

angular.module('UserApp.userFactory', [])
	.factory('UserFactory', function ($http) {
		var factory = {};
		var RESTFUL = {
			host : 'http://68.178.129.69',
			port : '8888',
			apiPath : '/api/user'
		};
		
		factory.getUsers = function () {
	        return $http.get(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath);
	    };
	    
	    factory.getUser = function (id) {
	    	return $http.get(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' + id);
	    };
		
	    factory.updateUser = function (user) {
	    	return $http.put(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' + user.user['_id'], user);
	    };
	    
	    factory.deleteUser = function (id) {
	    	return $http.delete(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' + id);
	    }
	    
	    factory.addUser = function (user) {
	    	return $http.post(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath, user);
	    }
		
		return factory;
});