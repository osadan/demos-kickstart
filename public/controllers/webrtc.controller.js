;(function () {
	'use strict';

	angular.module('demo')
		.controller('webrtcController', ['$scope', function ($scope) {
			var self = this;
			var pc1,pc2;
			var localstream; 
			var sdpConstraints = {
				'mandatory' : {
					'OfferToReceiveAudio' : true,
					'OfferToReceiveVideo' : true
				}
			}
			var vid1 = document.getElementById('vid1');
			var vid2 = document.getElementById('vid2');
			
			var btn1 = document.getElementById('btn1');
			var btn2 = document.getElementById('btn2');
			var btn3 = document.getElementById('btn3');
			
			btn1.disabled = false;
			btn2.disabled = true;
			btn3.disabled = true;

			self.start = function(){
				navigator.webkitGetUserMedia({video:true,audio:true},self.gotStream,function(){})
				btn1.disabled = true;
			} 

			self.call = function (){
				btn2.disabled = true;
				btn3.disabled = false;
				var videoTracks = localstream.getVideoTracks();
				var audioTracks = localstream.getAudioTracks();
				var servers = null;

				//peer1 connection to server
				pc1 = new webkitRTCPeerConnection(servers);
				pc1.onicecandidate  = self.iceCallback1;

				//peer2 connection to server
				pc2 = new webkitRTCPeerConnection(servers);
				pc2.onicecandidate = self.iceCallback2;
				pc2.onaddstream = self.gotRemoteStream;

				pc1.addStream(localstream);
				pc1.createOffer(self.gotDescription1);
			}

			self.hangup = function(){
				pc1.close();
				pc2.close();
				//close connection to the server
				pc1 = null;
				pc2 = null;

				btn3.disabled = true;
				btn2.disabled = false;
			}

			self.gotRemoteStream = function(e){
				console.log('gotRemoteStream',e);
				self.attachMediaStream(vid2,e.stream);
			}

			self.gotDescription1 = function(description){
				console.log('gotDescription1',description);
				pc1.setLocalDescription(description);
				pc2.setRemoteDescription(description);
				
				pc2.createAnswer(self.gotDescription2,null,sdpConstraints);
			}

			self.gotDescription2 = function(description){
				console.log('gotDescription2',description);
				pc2.setLocalDescription(description);
				pc1.setRemoteDescription(description);	
			}

			self.gotStream = function (stream){
				console.log('gotStream',stream);
				self.attachMediaStream(vid1,stream)
				localstream = stream;
				btn2.disabled = false;
			}

			self.attachMediaStream = function(element, stream){
				var objectUrl = URL.createObjectURL(stream);
				console.log(objectUrl);
				element.src = objectUrl;
			}

			self.iceCallback1 = function(event){
				if(event.candidate){
					console.log('iceCallback1',event.candidate);
					pc2.addIceCandidate(new RTCIceCandidate(event.candidate))
				}
			}
			
			self.iceCallback2 = function(event){
				if(event.candidate){
					console.log('iceCallback2',event.candidate);
					pc1.addIceCandidate(new RTCIceCandidate(event.candidate))
				}
			}
		}])
}());