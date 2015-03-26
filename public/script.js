;(function () {
	'use strict';
	angular.module('oss',[])
		.provider('contacts', oss.service.contacts)
	angular.module('demo',[
		'oss',
		'ui.router',
		'ngAnimate',
		"pubnub.angular.service",
		'angularModalService',
		'ngPrettyJson'
		])
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
				.state('contacts',{
					url : "/contacts",
					templateUrl : '/templates/contacts.tpl.html',
					controller : 'contactsController',
					controllerAs : 'contacts'
				})
				.state("webrtc",{
					url : '/webrtc',
					templateUrl  : "/templates/webrtc.tpl.html",
					controller : "webrtcController",
					controllerAs : "webrtc"
				})
		}])
		.run([function(){
			console.log('app start running');
		}])
		.controller('demoController',['$scope',function($scope){
			$scope.message = 'hello world';
		}]);
}());