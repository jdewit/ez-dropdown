angular.module('ez.dropdown', [])

.controller('DropdownCtrl', ['$scope', '$document', '$compile', function($scope, $document, $compile) {
  var isShown = false;
  var isCompiled = false;
  var $dropdownEl;
  var $dropdownMenuEl;
  var toggleFn;
  var allowClickInside;
  var cloneEl;

  var toggleMenu = function(e, noDigest) {
    if (allowClickInside && !!cloneEl && !!e && cloneEl.contains(e.target) && e.target.getAttribute('ng-click') !== 'toggleMenu()') {
      return;
    }

    if (isShown) {
      $document.off('click', toggleMenu);

      $dropdownEl.removeClass('open');
    } else {
      if (!isCompiled) {
        isCompiled = true;

        // must clone content so it does not get overwritten
        $compile($dropdownMenuEl)($scope, function(clone) {
          cloneEl = clone[0];
          $dropdownEl.append(clone);
        });
      }

      // allow first click to happen
      setTimeout(function() {
        $document.on('click', toggleMenu);
      });

      $dropdownEl.addClass('open');
    }

    isShown = !isShown;

    if (typeof toggleFn === 'function') {
      toggleFn(isShown);
    }

    if (!noDigest) {
      $scope.$apply();
    }
  };

  this.toggleMenu = toggleMenu;

  this.init = function(el, dropdownMenuEl, attrs) {
    $dropdownEl = el;
    $dropdownMenuEl = dropdownMenuEl.clone();
    toggleFn = attrs.onToggle !== null ? $scope.$eval(attrs.onToggle) : null;
    allowClickInside = attrs.hasOwnProperty('clickInside');

    if (!!attrs.open) {
      $scope.$watch(attrs.open, function(newVal) {
        if (!!newVal) {
          toggleMenu(null, true);
        }
      });
    }
  };

  $scope.$on('$destroy', function() {
    $document.off('click', toggleMenu);
    $dropdownEl = $dropdownMenuEl = null;
  });
}])

.directive('dropdown', [function() {
  return {
    restrict: 'C',
    controller: 'DropdownCtrl',
    compile: function(el, attrs) {
      var $dropdownMenuEl = el.find('.dropdown-menu').remove();

      return function(scope, el, attrs, ctrl) {
        ctrl.init(el, $dropdownMenuEl, attrs);
      };
    }
  };
}])

.directive('dropdownToggle', [function() {
  return {
    restrict: 'C',
    require: '^dropdown',
    link: function(scope, el, attrs, ctrl) {
      el.on('click', ctrl.toggleMenu);

      scope.$on('$destroy', function() {
        el.off('click', ctrl.toggle);
      });
    }
  };
}]);

