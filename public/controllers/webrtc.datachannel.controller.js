;(function () {
	'use strict';

	angular.module('demo')
		.controller('webRtcDataChannelController',['$scope',function($scope){
			var self = this;
			console.trace('web rtc data channel controller');
			var pc1,pc2,sendChannel,receiveChannel;
			
			var startButton = document.getElementById('startButton');
			var sendButton = document.getElementById('sendButton');
			var closeButton = document.getElementById('closeButton');

			startButton.disabled = false;
			sendButton.disabled = true;
			closeButton.disabled = true;

			self.createConnection = function(){
				console.trace('createConnection');
				var servers = null;
				pc1 = new webkitRTCPeerConnection(servers,{
					optional : [{RtpDataChannels : true}]
				});
				try{
					sendChannel = pc1.createDataChannel("SendDataChannel",{
						reliable : false
					});
				}
				catch(e){
					alert('Failed to create data channel.');
				}
				pc1.onicecandidate = self.iceCallback1;
				
				sendChannel.onopen = self.onSendChannelStateChange;
				sendChannel.onClose = self.onSendChannelStateChange;

				pc2 = new webkitRTCPeerConnection(servers,{
					optional :[{RtpDataChannels :true}]
				});
				pc2.onicecandidate = self.iceCallback2;
				pc2.ondatachannel = self.receiveChannelCallback;

				pc1.createOffer(self.gotDescription1);
				startButton.disabled = true;
				sendButton.disabled = false;

			}

			self.sendData = function(){
				var data = document.getElementById('dataChannelSend').value;
				sendChannel.send(data);
			}

			self.closeDataChannel = function (){
				sendChannel.close();
				receiveChannel.close();
				pc1.close();
				pc2.close();

				pc1 = null;
				pc2 = null;

				startButton.disabled = false;
				sendButton.disabled = true;
				closeButton.disabled = true;

				document.getElementById('dataChannelSend').value = '';
				document.getElementById('dataChannelSend').value = ''
				document.getElementById('dataChannelSend').disabled = true;
			}

			self.gotDescription1 = function (desc){
				console.trace('gotDescription1',desc);
				pc1.setLocalDescription(desc);
				pc2.setRemoteDescription(desc);
				pc2.createAnswer(self.gotDescription2);
			}

			self.gotDescription2 = function (desc){
				console.trace('gotDescription2',desc);
				pc2.setLocalDescription(desc);
				console.trace('Answer from pc2 \n' + desc.sdp);
				pc1.setRemoteDescription(desc);
			}

			self.iceCallback1 = function(event){
				if(event.candidate){
					pc2.addIceCandidate(event.candidate);
				}	
			}
			self.iceCallback2 = function(event){
				if(event.candidate){
					pc1.addIceCandidate(event.candidate);
				}	
			}

			self.onSendChannelStateChange = function(){

			}

			self.receiveChannelCallback = function(event){
				console.trace('receiveChannelCallback');
				receiveChannel = event.channel;
				receiveChannel.onmessage = self.onReceiveMessageCallback;
				receiveChannel.onopen  = self.onReceiveChannelStateChange;
				receiveChannel.onclose = self.onReceiveChannelStateChange;
			}

			self.onReceiveMessageCallback = function(event){
				console.trace('onReceiveMessageCallback');
				document.getElementById('dataChannelReceive').value = event.data;
			}

			self.onReceiveChannelStateChange = function() {
				console.trace('onReceiveChannelStateChange');
				var readyState = receiveChannel.readyState;
				console.trace('readyState',readyState);
			}

			self.onSendChannelStateChange = function(){
				console.trace('onSendChannelStateChange');
				var readyState = sendChannel.readyState;
				console.trace('readyState',readyState);
				if(readyState == 'open'){
					document.getElementById('dataChannelSend').disabled = false;
					sendButton.disabled = false;
					closeButton.disabled = false;
				}else{
					document.getElementById('dataChannelSend').disabled = true;
					sendButton.disabled = true;
					closeButton.disabled = true;	
				}
			}



		}]);
}());