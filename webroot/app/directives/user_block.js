'use strict';

angular.module('UserApp.userBlock', [])
	.directive('userBlock', function () {
		return {
			restrict : 'E',
			
			scope : {
				user : '='
			},
			
			templateUrl : '/app/partials/directives/UserBlock.html',
			
			replace : true,
			
			controller : function () {
			},
			
			link : function (scrope, element, attrs) {}
			
		}
	});