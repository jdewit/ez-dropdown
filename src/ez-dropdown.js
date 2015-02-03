angular.module('ez.dropdown', [])

.controller('DropdownCtrl', ['$scope', '$document', '$compile', function($scope, $document, $compile) {
  var isCompiled = false;
  var $dropdownEl;
  var $dropdownMenuEl;
  var cloneEl;

  var hideFn = function(e) {
    if (!!e && !!$scope.clickInside && !!cloneEl && cloneEl.contains(e.target)) {
      setTimeout(function() {
        $document.one('click', hideFn);
      });
    } else {
      $scope.isOpen = false;
      $scope.$apply();
    }
  };

  var show = function() {
    if (!isCompiled) {
      isCompiled = true;

      // must clone content so it does not get overwritten
      $compile($dropdownMenuEl)($scope.$parent, function(clone) {
        cloneEl = clone[0];
        $dropdownEl.append(clone);
      });
    }

    // allow first click to happen
    setTimeout(function() {
      $document.one('click', hideFn);
    });

    $dropdownEl.addClass('open');

    if (typeof $scope.onToggle === 'function') {
      $scope.onToggle(true);
    }
  };

  var hide = function() {
    $dropdownEl.removeClass('open');

    if (typeof $scope.onToggle === 'function') {
      $scope.onToggle(false);
    }

    $document.off('click', hideFn);
  };

  this.init = function(el, dropdownMenuEl) {
    $dropdownEl = el;
    $dropdownMenuEl = dropdownMenuEl.clone();

    $scope.$watch('isOpen', function(newVal, oldVal) {
      if (newVal === oldVal) {
       return;
      }

      if (!!newVal) {
        show();
      } else {
        hide();
      }
    });
  };

  this.toggle = function() {
    $scope.isOpen = !$scope.isOpen;
  };

  $scope.$on('$destroy', function() {
    $dropdownEl = $dropdownMenuEl = cloneEl = null;
  });
}])

.directive('dropdown', [function() {
  return {
    restrict: 'C',
    controller: 'DropdownCtrl',
    scope: {
      isOpen: '=?',
      clickInside: '=?',
      onToggle: '=?',
    },
    compile: function(el) {
      var $dropdownMenuEl = el.find('.dropdown-menu').remove();

      return function(scope, el, attrs, ctrl) {
        ctrl.init(el, $dropdownMenuEl);
      };
    }
  };
}])

.directive('dropdownToggle', [function() {
  return {
    restrict: 'C',
    require: '^dropdown',
    link: function(scope, el, attrs, ctrl) {
      el.on('click', function(e) {
        ctrl.toggle();
        scope.$apply();
      });
    }
  };
}]);

