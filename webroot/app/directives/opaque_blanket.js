
angular.module('UserApp.blanket', [])
	.directive('uaBlanket', function ($compile, $document) {
		return {
			
			restrict : 'A',
			
			scope : false,
			
			controller : function ($scope, $compile) {								
				
			},
			
			link : function (scope, element, attrs) {								
				
				var fadeTime = parseInt(attrs.uaFadeTime),
					title = attrs.uaFadeTitle || "";
				
				scope.showBlanket = function(){
					addBlanket();
				};
					
				scope.hideBlanket = function () {					
					$(".blanket, .blanketText").animate({opacity : 0}, {
						duration : scope.fadeTime || fadeTime,
						done : function () {
							$("#blanket-container").remove();
						}
					});
				}
				
				function addBlanket(){
					var numOfBlankets = $("#blanket-container").length;
					
					// make sure you don't add multiple blankets!
					if(numOfBlankets === 0){
						// Get the height of the document (to include scrolling)
						scope.height = $document[0].documentElement.clientHeight;
						
						scope.$watch(function (){
							scope.height = $document[0].documentElement.clientHeight;
						});
											
						var $template =	$('<div id="blanket-container">' + 
											'<div class="blanketText" style="font-size: 70px;text-align: center;position: absolute;z-index: 1002;color: white;width: 100%;top: 150px;">'+title+'</div>'+
											'<div class="blanket" style="top:0px;left:0px;border: 1px solid red; width: 100%; font-size: 20px; position: absolute; z-index: 1001; background-color: black; opacity: 0.5;margin: 0 auto;" class="ng-scope"></div>'+
										'</div>');
						
						$template.find(".blanket").height(scope.height);
															
						element.before($compile($template)(scope));
					}
				}
			}
		}
	});