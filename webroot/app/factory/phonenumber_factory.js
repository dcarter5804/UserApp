'use strict';

angular.module('UserApp.phonenumberFactory', [])
	.factory('PhonenumberFactory', function ($http) {
		var factory = {};
		var RESTFUL = {
			host : 'http://68.178.129.69',
			port : '8888',
			apiPath : '/api/user/phonenumbers'
		};
		
		factory.addPhonenumber = function (phonenumber, id) {
			return $http.post(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' + id , phonenumber);
		};
		
		factory.deletePhonenumber = function (phonenumberID, userID) {
			return $http.delete(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' + userID + '/' +  phonenumberID);
		};
		
		factory.updatePhonenumber = function (phonenumber, userID) {
			return $http.put(RESTFUL.host + ":" + RESTFUL.port + RESTFUL.apiPath + '/' +userID, phonenumber);
		}
		
		/*
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
	    */
		
		return factory;
});