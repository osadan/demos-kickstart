;(function () {
	'use strict';

	angular.module('demo')
		.directive('menu',[function(){
			return{
				restrict : 'AE',
				templateUrl : "/directives/menu/menu.tpl.html"
			}
		}])
}());