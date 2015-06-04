;(function () {
	'use strict';
	angular.module('demo')
		.directive('typeaheadItem', [function () {
        return {
            restrict: 'AE',
            require: "^typeahead",
            scope: {
                item: "@",
                index: "@"
            },
            link: function($scope, $element, $attributes, $controller) {
                var _$scope = $scope;
                var _$controller = $controller;

                function itemClick() {
                    _$controller.setCurrent(_$scope.index);
                    _$controller.handleSelection(JSON.parse(_$scope.item));
                }
                
                $element.on('click', itemClick);

                $scope.$on(
                    "$destroy",
                    function handleDestroyEvent() {
                        $element.off('click', itemClick);
                    }
                );
 			}
		}
	}])
}());