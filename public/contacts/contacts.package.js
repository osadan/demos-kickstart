;(function() {
	'use strict';

	var app = angular.module('oss.contacts',[]);
		app.service('contacts',['googleApiConnection','$filter',oss.service.contacts])
		.filter('parseGroupResult',oss.filters.parseGroupResult)
		.filter('parseContactResult',oss.filters.parseContactResult)
		.provider('googleApiConnection',oss.service.googleApiConnection)
		.value('gapi',oss.service.gapi)
		.config(['googleApiConnectionProvider',function(googleApiConnectionProvider){
			
			var clientId = "101194004303-ftum1rdv5q5776qat2enneff46e6v4tc.apps.googleusercontent.com";
    		var clientSecret = "JENhAAuDxNLcejlQMGlYX3dL";
    		var apiKey = "AIzaSyBrDncK10AwpeuK8R66p08zwF9VneJxoqw";
    		var scopes = ['https://www.googleapis.com/auth/userinfo.email','https://www.google.com/m8/feeds'];
			googleApiConnectionProvider.init(apiKey,clientId,scopes);
			
			//var scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds';
		}])

})();