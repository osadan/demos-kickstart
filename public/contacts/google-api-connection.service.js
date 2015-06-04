var oss = oss || {};

oss.service = oss.service || {};

oss.service.googleApiConnection = (function() {
	'use strict'
	var _apiKey,_clientId,_scopes;
	
	var versionHeader = {
        name: 'GData-Version',
        value: "3.0"
    };
    
    var oauthToken = {};
    
    var mainApiPath = "https://www.google.com/m8/feeds/";

	var init = function(apiKey,clientId,scopes){
		_apiKey = apiKey;
		_clientId = clientId;
		_scopes = scopes.join(' ');
	}

	var GoogleApiConnection = function($q,gapi,$http){
		var self = this;
		var loadDeffered = $q.defer();
		 
		 self.connect = function connect() {
            gapi.client.setApiKey(_apiKey);
            setTimeout(self.checkAuth, 1);
            return loadDeffered.promise;
        }

        self.checkAuth = function checkAuth() {
            gapi.auth.authorize({
                client_id: _clientId,
                scope: _scopes,
                immediate: true
            }, self.handleAuthResult);
        }

        self.handleAuthResult = function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                oauthToken  = gapi.auth.getToken();
                loadDeffered.resolve(oauthToken);
            } else {
                self.handleAuthClick();
            }
        }

        self.handleAuthClick = function handleAuthClick() {
            gapi.auth.authorize({
                client_id: _clientId,
                scope: _scopes,
                immediate: false
            }, self.handleAuthResult);
            loadDeffered.resolve();
        }

        self.request = function request(type,params){
            if(!oauthToken.access_token){
                self.handleAuthClick()
            }
            if(!params){
                var params = [];
            }
            params.push({alt : 'json'});
            params.push({v : "3.0"});
            params.push({access_token: oauthToken.access_token });
            var queryString = _.map(params,function(item){
                    var key  =  Object.keys(item)[0];
                   return  key + '='  + item[key]; 
            });

            var path = mainApiPath + type + '/default/full?' + queryString.join("&");
            return $http({
                method : "GET",
                url : path
            });
        }

        self.disconnect = function disconnect(access_token){

    		var disconnectPath = 'https://accounts.google.com/o/oauth2/revoke?token=' +access_token;
    		return $http.get(disconnectPath).then(function (result){
    			console.log('user disconnected',result);
    			return result;
    		})
    	}
	}

	return {
		init : init,
		$get : ['$q','gapi','$http',function($q,gapi,$http){
			return new GoogleApiConnection($q,gapi,$http);
		}]
	};
})();