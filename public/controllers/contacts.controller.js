;(function () {
	'use strict';

	angular.module('demo')
		.controller('contactsController',['contacts',function(contacts){
			var self = this;
			self.results = [];
			self.token = {};
			self.groupId = 'http://www.google.com/m8/feeds/groups/sadanoh@gmail.com/base/6208bb308f1b9737';
			
			self.checkAuth = function checkAuth(){
				contacts.handleClientLoad().then(function(result){
					var tmp = {};
					_.each(result,function(value,key){
						
						tmp[key] = value;	
					});
					self.token = tmp;
				});
			}
			
			self.getGroups = function getGroups(){
				contacts.apiCallGroups().then(function(result){
					self.groups = result;
				});
			}
			
			self.getContacts = function getContacts(params){
				contacts.apiCallContacts(params).then(function(result){
					self.contacts = result;	
				});
			}
			self.displayGroup = function displayGroup(event){
				var params = [];
				var groupId = event.target.dataset['itemid'];
				params.push({group: groupId},{"max-results" : 100 });
				self.getContacts(params);
			}

			self.imagePath = function imagePath(link){
				var path = [];
				path.push(link.href);
				path.push('&access_token='+ self.token.access_token);
				return path.join('');
			}

			self.search = function search(){

			}

		}]);
}());