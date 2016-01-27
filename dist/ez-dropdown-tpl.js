angular.module('ez.dropdown').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ez-dropdown-menu.html',
    "<ul class=\"dropdown-menu dropdown-dynamic-menu\" ng-class=\"{'dropdown-drilldown-menu': menu.isDrilldown, 'dropdown-pointer': options.dropdownPointer}\"><li ng-repeat=\"(alias, item) in menu.items track by $index\" ng-class=\"{active: item.active, open: item.open}\" ng-if=\"item.conditional\"><a ng-click=\"select(item)\"><i ng-if=\"!!item.icon\" class=\"{{ item.icon }}\"></i> {{ options.getNameFn(item) }}</a><ul ng-if=\"menu.isDrilldown && !!item.items\" collapse=\"!item.open\"><li ng-repeat=\"(alias, subItem) in item.items track by $index\" ng-class=\"{active: subItem.active}\" ng-if=\"subItem.conditional\"><a ng-click=\"select(subItem, true)\"><i ng-if=\"!!item.icon\" class=\"{{ subItem.icon }}\"></i> {{ options.getNameFn(subItem) }}</a></li></ul></li></ul>"
  );

}]);
