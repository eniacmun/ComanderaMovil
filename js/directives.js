angular.module('starter.Directives', [])
.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter, {
                            'event': event
                        });
                    });
                    event.preventDefault();
                }
            });
        };
    })
	.directive('limitChar', function() {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            limit: '=limit',
            ngModel: '=ngModel'
        },
        link: function(scope) {
            scope.$watch('ngModel', function(newValue, oldValue) {
                if (newValue) {
                    var length = newValue.toString().length;					
                    if (length > scope.limit) {
                        scope.ngModel = oldValue;
                    }
                }else{
					if(oldValue){
						if(oldValue.toString().length==1){
							scope.ngModel=""
						}else{
							scope.ngModel = oldValue;
						}
					}
				}
            });
        }
    };
})
	.directive('myFocus', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        if (attrs.myFocus == "") {
          attrs.myFocus = "focusElement";
        }
        scope.$watch(attrs.myFocus, function(value) {
          if(value == attrs.id) {
            element[0].focus();
          }
        });
        element.on("blur", function() {
          scope[attrs.myFocus] = "";
          scope.$apply();
        })        
      }
    };
  });
;
