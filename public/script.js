;(function () {
	'use strict';

	angular.module('demo',['ui.router','ngAnimate',"pubnub.angular.service",'angularModalService'])
		.config(["$stateProvider",function($stateProvider){
			$stateProvider
				.state('main',{
					url : '/',
				})
				.state('pubnub',{
					url : '/pubnub',
					templateUrl : '/templates/pubnub.tpl.html',
					controller : 'pubNubController',
					controllerAs : 'pubnub'				
				})
		}])
		.run([function(){
			console.log('app start running');
		}])
		.controller('demoController',['$scope',function($scope){
			$scope.message = 'hello world';
		}]);
}());