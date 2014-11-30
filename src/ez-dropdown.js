angular.module('ez.dropdown', [])
.directive('dropdown', ['$document', '$compile', function($document, $compile) {
  return {
    restrict: 'C',
    controller: function($scope) {
      var isShown = false;
      var isCompiled = false;
      var $dropdownEl;
      var $dropdownMenuEl;
      var toggleFn;
      var allowClickInside;

      var toggleMenu = function(e) {
        if (allowClickInside && $dropdownMenuEl[0].contains(e.target)) {
          return;
        }

        if (isShown) {
          $document.off('click', toggleMenu);

          $dropdownEl.removeClass('open');
        } else {
          if (!isCompiled) {
            isCompiled = true;

            // must clone content so it does not get overwritten
            $compile($dropdownMenuEl.clone())($scope, function(clone) {
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

        $scope.$apply();
      };

      this.toggleMenu = toggleMenu;

      this.init = function(el, dropdownMenuEl, attrs) {
        $dropdownEl = el;
        $dropdownMenuEl = dropdownMenuEl;
        toggleFn = attrs.onToggle !== null ? $scope.$eval(attrs.onToggle) : null;
        allowClickInside = attrs.hasOwnProperty('clickInside');
      };

      $scope.$on('$destroy', function() {
        $document.off('click', toggleMenu);
        $dropdownEl = $dropdownMenuEl = null;
      });
    },
    compile: function(el, attrs) {
      var $dropdownMenuEl = el.find('.dropdown-menu').remove();

      return function(scope, el, attrs, ctrl) {
        ctrl.init(el, $dropdownMenuEl, attrs);
      };
    }
  };
}])
.directive('dropdownToggle', ['$document', '$compile', function($document, $compile) {
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

