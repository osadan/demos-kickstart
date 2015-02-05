;(function () {
	'use strict';

	angular.module('demo',[])
		.controller('demoController',['$scope',function($scope){
			$scope.message = 'hello world';
		}]);
}());