'use strict';

angular.module('UserApp.cookieFactory', [])
	.factory('CookieFactory', function () {
		var factory = {};
	    
		factory.getCookie = function(name){
			return $.cookie(name);
	    };
	
	    factory.getAllCookies = function(){
	     	return $.cookie();
	    };
	
	    factory.setCookie = function(name, value){
	    	return $.cookie(name, value);
	    },
	
	    factory.deleteCookie = function(name){
	    	return $.removeCookie(name);
	    };
	    
	    return factory;
	    
    }
);