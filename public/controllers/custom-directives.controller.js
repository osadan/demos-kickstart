;
(function() {
    'use strict';

    angular.module('demo')
        .controller('customDirectiveController', ['$scope', function($scope) {
            var self = this;
            self.selectedItem = undefined;
           
            self.flagsList = [{
                class: "il",
                label: "Israel"
            }, {
                class: "us",
                label: 'United States'
            }, {
                class: "ca",
                label: "Canada"
            }, {
                class: "ir",
                label: "Iraq"
            }]

            self.selectFlag = function(item){
            	self.selectedItem = item;
            }

            

        }]);
}());
