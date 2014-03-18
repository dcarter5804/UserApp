//var userApp = angular.module('UserApp',['ngRoute']);

angular.module('UserApp', 
	[
		 'ngRoute',
		 'ui.bootstrap',
		 
		 /* Services */
         'UserApp.modalService',
		 
		 /* Controllers */
		 'UserApp.modalsController',
         'UserApp.homepageController',
         'UserApp.editContactController',
         'UserApp.addContactController',
         'UserApp.loginController',
                     	
         /* Factories */
         'UserApp.userFactory',
         'UserApp.authenticationFactory',
         'UserApp.cookieFactory'
    ]
)
.config(function ($routeProvider, $provide, $httpProvider) {
	// Application Routes
	$routeProvider.when('/login', {templateUrl : 'app/partials/login/Login.html', controller : 'LoginController'});
	$routeProvider.when('/home', {templateUrl : 'app/partials/home/HomePageUsers.html', controller : 'HomePageUsersController'});
	$routeProvider.when('/editUser/:userId', {templateUrl : 'app/partials/edit-user/EditUser.html', controller : 'EditUserController'});
	$routeProvider.when('/addUser', {templateUrl : 'app/partials/add-user/AddUser.html', controller : 'AddUserController'});
	$routeProvider.otherwise({redirectTo : '/login'});
	
	//var test = ModalService;
	
	// Intercetpors
	$provide.factory('authenticationInterceptor', function($q, $location, CookieFactory) {
		var factory = {};
		
		// optional method
		factory.request = function(config) {
	    	var SERVER_BASE_REGEXP = /(http:\/\/[^\/]+\/)(.*)/,
	    		URL = config.url,
	    		// get the api call
	    		path = URL.replace(SERVER_BASE_REGEXP, '$2');
	    	
	    	// if the call starts with API (not authorization), add the token
	    	if(/^api/.test(path.toLowerCase())){
	    		
	    		// Get the token from the cookie
	    		var token = CookieFactory.getCookie("token");
	    		
	    		//Make sure there is a token
	    		if(token){
	    			
	    			// Create the token object
	    			var tokenObj = {access_token : token};
	    			
	    			// If this is a post call
	    			if(config.method.toLowerCase() === 'post'){
	    				
		    			// If there is data on the call
	                    if(config.data){
	                        // insert the token into the request
		    			    $.extend(config.data, tokenObj);
	                    }
	                    
	                    // If there is no data, add it and set the token
	                    else{
	                        config['data'] = tokenObj;
	                    }
	    			}
	    			
	    			// If this is a get
	    			if(config.method.toLowerCase() === 'get'){
	    				var tokenParam = decodeURIComponent($.param(tokenObj)),
	    					paramDelimiter = (/\?/.test(config.url)) ? "&" : "?";
	    				
	    				// Add the token parameter
	    				config.url = config.url + paramDelimiter  + tokenParam;
	    			}
                    
	    		}
	    		
	    	}
	    		
			return config || $q.when(config);
		};
		
		factory.responseError = function(rejection) {
	        var statusCode = parseInt(rejection.status);
	        
	        // If its a 401, force user to the login screen
	        if(statusCode === 401){       		        		        	
	        	$location.path("#/login");
            }
	        
	        return $q.reject(rejection);
		};
	      
		return factory;
	});
	
	// Add the interceptors
	$httpProvider.interceptors.push('authenticationInterceptor');
	
});