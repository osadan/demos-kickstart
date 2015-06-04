/**
 * <div typeahead class='autocomplete-region' 
 *     list                 ='someObject' 
 *     display-key          ="label" 
 *     prompt               ='Enter city, state or area code' 
 *     list-container-class = "region-search-results" 
 *     item-selected        ='func(item)' >
        <ul class='region-search-results' 
            ng-show ="typeahead.toDisplay()">
                <li typeahead-item class="autocomplete-item"
                    ng-repeat='item in typeahead.filtered =  (typeahead.list | filter:typeahead.model) track by item.search' 
                    item="{{::item}}" 
                    index="{{$index}}" 
                    ng-class="{'selected':typeahead.isCurrent($index)}"  >
                    <span>{{::item.label}}</span>
                </li>
            </ul>
        </div>
 */

;(function () {
	'use strict';

	angular.module('demo')
        .directive('typeahead', ['$document', function($document) {
            var hotkeys = {
                9: {
                    name: 'tab'
                },
                13: {
                    name: 'enter'
                },
                27: {
                    name: 'escape'
                },
                38: {
                    name: 'up'
                },
                40: {
                    name: 'down'
                }
            };
			return {
                restrict: 'AE',
                template: "<div></div>",
                transclude: true,
                scope: {
                    itemSelected: '&',
                    list: "=",
                    prompt: "@",
                    displayKey: "@",
                    defaultValue: '@',
                    listContainerClass: "@"
                },
                controllerAs: 'typeahead',
				controller: function($scope) {
                    
                    var self = this;
                    self.displayStatus = 'hidden';
                    self.model = "";
                   	self.list = $scope.list;
                    self.current = -1;
                    self.selectedItem = undefined;

                    $scope.$watch("list",function(){
                    	self.list = $scope.list;
                    });

                    this.setListContainer = function setListContainer($element) {
                        self.listContainer = $element[0].querySelector('.' + $scope.listContainerClass);
                    }

                    this.handleSelection = function handleSelection(selectedItem) {
                        self.model = selectedItem[$scope.displayKey];
                        self.current = -1;
                        self.selected = true;
                        self.selectedItem = selectedItem;
                        $scope.itemSelected({
                            item: selectedItem
                        });
                    }
					
                    this.toggleView = function (){
                        console.log("toggle view",self.displayStatus);
                        if (self.displayStatus != 'hidden') {
                            self.displayStatus = 'hidden';
                            $document.off('click', documentClick);
                        }
                        else if (self.displayStatus != 'visible') {
                            self.displayStatus = 'visible';
                            $document.on('click', documentClick);
                        }
                    }

                    this.clickView = function clickView (){
                        //console.log('click view',self.displayStatus);
                        return self.displayStatus !== 'hidden';
                           
                    }

					this.isCurrent = function isCurrent(index) {
                        return (self.current * 1) === (index * 1);
                    }

                    this.setCurrent = function setCurrent(index) {
                        self.current = index;
                    }

                    this.activateNextItem = function activateNextItem() {
                        if (self.current + 1 === self.filtered.length) {
                            self.current = 0;
                        } else {
                            self.current++;
                        }
                    }

                    this.activatePrevItem = function activatePrevItem() {
                        if (self.current - 1 < 0) {
                            self.current = self.filtered.length - 1;
                        } else {
                            self.current--;
                        }
                    }

                    this.handleKeypress = function handleKeypress(key) {
                        switch (key) {
                            case "tab":
                            case "enter":
                                self.handleSelection(self.filtered[self.current]);
                                break;
                            case "down":
                                self.activateNextItem();
                                self.setScroll('down');
                                break;
                            case "up":
                                self.activatePrevItem();
                                self.setScroll('up');
                                break;
                            case "escape":
                                self.current = -1;
                                self.selected = true;
                                break;
                        }
                        $scope.$digest();
                    }

                    this.setScroll = function setScroll(direction) {
                        var offsetHeight = self.listContainer.offsetHeight - 4, //4 is for border
                            itemOffsetHeight = self.listContainer.children[0].offsetHeight,
                            itemsPerView = Math.ceil(offsetHeight / itemOffsetHeight);
                        //for the top one to prevent scrolling
                        if ( (self.current + 1) * itemOffsetHeight <= offsetHeight) {
                            self.listContainer.scrollTop = 0;
                        } 
                        else {
                            if (direction == 'down') {
                                //only if you are the last visible on the list scroll down
                                if( self.current * itemOffsetHeight >= self.listContainer.scrollTop + (4 * itemOffsetHeight)   ){    
                                    self.listContainer.scrollTop = self.listContainer.scrollTop + itemOffsetHeight;
                                }
                            
                            } else if (direction == 'up') {
                                //rule when switiching from the first one to the last one
                                if (self.current == self.filtered.length - 1) {
                                    self.listContainer.scrollTop = self.current * itemOffsetHeight;
                                } else {
                                    //onyly if you are the first on the list scroll up
                                    if( self.current  * itemOffsetHeight  <= self.listContainer.scrollTop ){
                                        self.listContainer.scrollTop = self.current * itemOffsetHeight;
                                    }
                                }
                            }
                        }
                    }

                    $scope.$on(
                        "$destroy",
                        function handleDestroyEvent() {
                            $document.off('click', documentClick);
                        }
                    );

                    function documentClick($event) {
                        console.log('document click');
                        if($event.target.classList.contains('click-target') || document.querySelector('.click-target').contains($event.target)){
                            return false;
                        }
                        
                        $event.stopPropagation();
                        self.selected = true;
                        self.toggleView();
                        $scope.$evalAsync();
                    }
				},
                link: function($scope, $element, $attributes, $controller, transcludeFn) {
                    var _$scope = $scope;
                    transcludeFn($scope, function(clone, $scope) {
                        $element.append(clone);
                        $controller.setListContainer($element);
                    });

                    $element.on('keydown', function($event) {
                        var key = hotkeys[$event.keyCode];
                        if (!key) {
                            $controller.setCurrent(-1);
                            return;
                        }

                        $controller.handleKeypress(key.name);
                    });
				}
			}
        }]);
}());