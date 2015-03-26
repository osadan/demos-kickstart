  /*gapi.client.load('oauth2', 'v2', function() {
                    var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function(resp) {
                        data.push(resp.email);
                        data.push(authResult.access_token);
                        console.log(data);
                    });
                });*/

/**
 * Contacts query parameters reference

        The Contacts Data API supports the following standard Google Data API query parameters:

        Name        Description
        alt         The type of feed to return, such as atom (the default), rss, or json.
        q           Fulltext query on contacts data fields. The API currently supports simple search queries such as q=term1 term2 term3 and exact search queries such as q="term1 term2 term3"
        max-results The maximum number of entries to return. If you want to receive all of the contacts, rather than only the default maximum, you can specify a very large number for max-results.
        start-index The 1-based index of the first result to be retrieved (for paging).
        updated-min The lower bound on entry update dates.
        For more information about the standard parameters, see the Google Data APIs protocol reference document.

        In addition to the standard query parameters, the Contacts Data API supports the following parameters:

        Name                Description
        orderby             Sorting criterion. The only supported value is lastmodified.
        showdeleted         Include deleted contacts in the returned contacts feed. Deleted contacts are shown as entries that contain nothing but an <atom:id> element and a <gd:deleted> element. (Google usually retains placeholders for deleted contacts for 30 days after deletion; during that time, you can request the placeholders using the showdeleted query parameter.) Valid values are true or false. When the server decides it cannot guarantee that it still has information about all deleted contacts pertinent to the query, then it's behavior depends on the value of the requirealldeleted query parameter.
        requirealldeleted   Only relevant if showdeleted and updated-min are also provided. It dictates the behavior of the server in case it detects that placeholders of some entries deleted since the point in time specified as updated-min may have been lost. If requirealldeleted is false, the server simply returns all the placeholders it still knows about. If true, the server returns the 410 HTTP response code. The default value is false.
        sortorder           Sorting order direction. Can be either ascending or descending.
        group               Constrains the results to only the contacts belonging to the group specified. Value of this parameter specifies group ID (see also: gContact:groupMembershipInfo).

 * @type {[type]}
 */
var oss = oss || {};

oss.service = oss.service || {};

oss.service.contacts = (function() {
    var accessToken, clientId, clientSecret;
    var scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds';
    var versionHeader = {
        name: 'GData-Version',
        value: "3.0"
    };
    var clientId = "101194004303-ftum1rdv5q5776qat2enneff46e6v4tc.apps.googleusercontent.com";
    var clientSecret = "JENhAAuDxNLcejlQMGlYX3dL";
    var apiKey = "AIzaSyBrDncK10AwpeuK8R66p08zwF9VneJxoqw";
    var oauthToken = {};
    var mainApiPath = "https://www.google.com/m8/feeds/";
    var feedTypes = {
        groups : 'groups',
        contacts : 'contacts'
    }


    var setApiCredentials = function setApiCredentials(clientId, clientSecret) {

    }
    var init = function() {

    }

    function Contacts($http,$q) {
        var self = this;
        var loadDeffered = $q.defer();
        var groupList = [];
        
        self.handleClientLoad = function handleClientLoad() {
            
            console.log('handle client load');
            gapi.client.setApiKey(apiKey);
            setTimeout(self.checkAuth, 1);
            return loadDeffered.promise;
        }

        self.checkAuth = function checkAuth() {
            console.log('check auth service');
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: true
            }, self.handleAuthResult);
        }

        self.handleAuthResult = function handleAuthResult(authResult) {
            console.log('handle auth result');
            if (authResult && !authResult.error) {
                oauthToken  = gapi.auth.getToken();
                loadDeffered.resolve(oauthToken);
                
            } else {
                self.handleAuthClick();
            }
        }

        self.handleAuthClick = function handleAuthClick() {
            console.log('handle auth click');
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false
            }, self.handleAuthResult);
            loadDeffered.resolve();
        }

        self.baseApiRequest = function baseApiRequest(type,params){
            if(!oauthToken.access_token){
                self.handleAuthClick()
            }
            if(!params){
                var params = [];
            }
            params.push({alt : 'json'});
            params.push({v : "3.0"});
            params.push({access_token: oauthToken.access_token });
            queryString = _.map(params,function(item){
                    var key  =  Object.keys(item)[0];
                   return  key + '='  + item[key]; 
            });

            var path = mainApiPath + type + '/default/full?' + queryString.join("&");
            return $http({
                method : "GET",
                url : path
            });
  
        }

        /**
         * gapi.client.load(API_NAME, API_VERSION, CALLBACK);
         * @return {[type]} [description]
         */
        self.apiCallContacts = function apiCallContacts(params) {
            
            return self.baseApiRequest(feedTypes.contacts,params).then(function(result){
                var result = self.parseContactsResults(result);
                return result;
            });
        }

        self.apiCallGroups = function apiCallGroups (params){
            return self.baseApiRequest(feedTypes.groups,params).then(function(result){
                var groupList =  self.parseGroupsResults(result);
                return groupList;
            });
        }



        self.disconnect = function disconnect(access_token){

    		var disconnectPath = 'https://accounts.google.com/o/oauth2/revoke?token=' +access_token;
    		return $http.get(disconnectPath).then(function (result){
    			console.log('user disconnected');
    			return result;
    		})
    	}

        self.parseContactsResults = function parseResults(result){
              var entries = result.data.feed.entry;
              var list = [];
              list = _.map(entries,function(item){
                   
                    var tmp = {};
                    tmp.id = item.id.$t;
                    if(item.gd$etag){
                        tmp.etag = item.gd$etag;
                    }
                    if(item.gd$email && item.gd$email.length > 0){
                        tmp.email = _.map(item.gd$email,function(emailItem){
                            return emailItem.address;    
                        })
                        
                    }
                    if(item.gd$name){
                        tmp.name = item.gd$name;
                    }
                    if(item.title.$t){
                        tmp.title = item.title.$t;
                    }
                    if(item.gContact$website && item.gContact$website.length > 0){
                        tmp.website = _.map(item.gContact$website,function(websiteItem){
                            return websiteItem.href;   
                        })
                    }
                    if(item.link){
                        tmp.link = item.link;
                    }
                    if(item.gd$phoneNumber){
                        tmp.phone = item.gd$phoneNumber;
                    }

                    //search also for images
                    return tmp;
              })
            return list;
        }

        self.parseGroupsResults = function parseGroupsResults (result){
            var entries = result.data.feed.entry;
            var list = _.map(entries,function parse(item){
                var tmp = {};
                
                tmp.id = item.id.$t;
                tmp.etag = item.gd$etag;
                tmp.content = item.content.$t;
                tmp.title= item.title.$t;
                if(item.gContact$systemGroup){
                    tmp.isSystemGroup = true;
                    tmp.systemGroupId = item.gContact$systemGroup.id;
                }
                
                return tmp;

            })
            return list;
        }


    }
    return {
        init: init,
        setApiCredentials: setApiCredentials,

        $get: ['$http','$q', function($http,$q) {
            return new Contacts($http,$q);
        }]
    }

}());
