;
(function() {
    'use strict';

    angular.module('demo')
        .controller('pubNubController', ['$rootScope','$scope', 'PubNub', function($rootScope,$scope, PubNub) {
            var self = this;
            self.currentCahnnel = '';
            self.list = [];
            self.subscribe = {};
            self.publish = {};

            

            self.init = function init() {

                PubNub.init({
                    publish_key: 'pub-c-495e0764-1778-43d2-9f03-c29b7e231b8a',
                    subscribe_key: 'sub-c-89dcd64a-86ed-11e4-a400-02ee2ddab7fe'
                });

                self.publish.channel = self.subscribe.channel = "b025c94e00eeb3202a28f161615c6a968eb0fc096604fb36fada3e1c0f8882f0";
                self.subscribe();
                 
            }

            self.subscribe = function subscribe() {
                console.log('subscribe');
                if(self.currentChannel){
                	PubNub.ngUnsubscribe({channel : self.currentChannel});
                }
                PubNub.ngSubscribe({
                    channel: self.subscribe.channel
				});

				$rootScope.$on(PubNub.ngMsgEv(self.subscribe.channel), function(event, payload) { 
					console.log('event recived data',arguments);
					self.list.push(payload);
					$scope.$digest();

				});
				self.currentChannel = self.subscribe.channel;

            };

            self.publish = function publish() {
            	console.log('publish',self.publish.data);
                PubNub.ngPublish({
                    channel:  self.publish.channel,
                    message: self.publish.data
                });
            };

            self.init();

        }])
}());
