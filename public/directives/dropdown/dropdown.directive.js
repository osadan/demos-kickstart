;
(function() {
    'use strict';
    angular.module('demo')
        .directive('dropdownFlags', [function() {
            return {
				restrict: "EA",
                templateUrl: "directives/dropdown/dropdown.tpl.html",

                scope: {
                    list: "=",
                    selected: "=",
                },

                controller: function() {
                    var self = this;
                    self.display = false;
                    self.selectedItem = undefined;

                    self.select = function(item) {
                        self.selectedItem = item;
                        self.toggle();
                        self.selected(item);
                    }

                    self.toggle = function() {
                        self.display = !self.display;
                    }


                },

                controllerAs: 'flags',

                bindToController: true,

                link: function($scope, $e, $a, $controller) {
                    $rootScope.$on("documentClicked", function(inner, target) {
                        if (!$(target[0]).is(".dropdown-display.clicked") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
                            scope.$apply(function() {
                                scope.listVisible = false;
                            });
                    });
                }
            }

        }])
}());
