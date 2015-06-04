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
    'use strict';

    
    
    
    
    
    var feedTypes = {
        groups : 'groups',
        contacts : 'contacts'
    }

    var filters = {
        groups : 'parseGroupResult',
        contacts : 'parseContactResult'
    }

    function Contacts(googleApiConnection,$filter) {
        var self = this;
        
        var groupList = [];
        
        /**
         * gapi.client.load(API_NAME, API_VERSION, CALLBACK);
         * @return {[type]} [description]
         */
        self.getContacts = function getContacts(params) {
            
            return googleApiConnection.request(feedTypes.contacts,params).then(function(result){
                var result = $filter(filters.contacts)(result);
                return result;
            });
        }

        self.getGroups = function getGroups (params){
            return googleApiConnection.request(feedTypes.groups,params).then(function(result){
                var groupList =  $filter(filters.groups)(result);
                return groupList;
            });
        }

         self.creataContact = function createContact(contact){

        }

        self.removeContact = function removeContact(contact){

        }

        self.updateContact = function updateContact(contact){

        }
        

        /*self.parseContactsResults = function parseResults(result){
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
        }*/

        /*self.parseGroupsResults = function parseGroupsResults (result){
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
        }*/

       


    }
    return Contacts;

}());
