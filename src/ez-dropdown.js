angular.module('ez.dropdown', [])

.controller('EzDropdownCtrl', ['$scope', '$document', '$compile', function($scope, $document, $compile) {
  var $window = $(window);
  var isCompiled = false;
  var $dropdownEl;
  var $dropdownMenuEl;
  var $cloneEl;
  var cloneEl;
  var $backdropEl;
  var $attrs;
  var self = this;

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

  this.show = function() {
    var windowWidth = $(window).width();

    if (!isCompiled) {
      isCompiled = true;

      // must clone content so it does not get overwritten
      $compile($dropdownMenuEl)($scope.$parent, function(clone) {
        $cloneEl = clone;
        cloneEl = clone[0];

        if ($attrs.absolute) {
          $dropdownEl = angular.element('<span class="dropdown dropdown-absolute"></span>');
          $dropdownEl.append($cloneEl);

          $('body').append($dropdownEl);
        } else {
          $dropdownEl.append($cloneEl);
        }
      });
    }

    if (!$attrs.mobileDisabled && !$dropdownEl.hasClass('dropdown-mobile')) {
      if (windowWidth < 768) {

        // allow menu heigh to take effect
        setTimeout(function() {
          var h = $(window).height();
          var menuHeight = $cloneEl.outerHeight();

          if (menuHeight > h) {
            $cloneEl.css('top', 10);
            $cloneEl.css('height', h - 20);
          } else {
            $cloneEl.css('top', (h - menuHeight) / 2);
          }
        });

        if (!$attrs.noBackdrop) {
          $backdropEl = angular.element('<div class="modal-backdrop in"></div>');
          $('body').append($backdropEl);
          $backdropEl.height($('body').height());
        }

        $dropdownEl.addClass('dropdown-mobile');
        $cloneEl.width(windowWidth - 40);
      }
    }

    if (!!$attrs.absolute && $scope.clickEvent) {
      var top = $scope.clickEvent.clientY + $(document).scrollTop();
      var left;
      var menuWidth = $cloneEl.width();

      if (($scope.clickEvent.clientX + menuWidth) > windowWidth) {
        left = $scope.clickEvent.clientX - menuWidth;
      } else {
        left = $scope.clickEvent.clientX;
      }

      $dropdownEl.css({
        top: top + 'px',
        left: left + 'px'
      });

      $scope.clickEvent = null;
    }

    $dropdownEl.addClass('open');

    if (typeof $scope.onToggle === 'function') {
      $scope.onToggle(true);
    }

    // apply hide fn on next click
    setTimeout(function() {
      $document.one('click', hideFn);
    });
  };

  this.hide = function() {
    $dropdownEl.removeClass('open');

    if ($dropdownEl.hasClass('dropdown-mobile')) {
      $dropdownEl.removeClass('dropdown-mobile');

      $cloneEl.css({
        top: 'auto',
        left: 0,
        width: 'auto'
      });
    }

    if (typeof $scope.onToggle === 'function') {
      $scope.onToggle(false);
    }

    if (!!$backdropEl) {
      $backdropEl.remove();
    }

    $document.off('click', hideFn);
  };

  this.toggle = function(e) {
    $scope.clickEvent = e;
    $scope.isOpen = !$scope.isOpen;
  };

  this.init = function(el, dropdownMenuEl, attrs) {
    $dropdownEl = el;
    $dropdownMenuEl = dropdownMenuEl.clone();
    $attrs = attrs;

    $scope.toggleFn = this.toggle;
  };

  $scope.$watch('isOpen', function(n, o) {
    if (n !== 0) {
      if (!!n) {
        self.show();
      } else {
        self.hide();
      }
    }
  });

  $scope.$on('$destroy', function() {
    if (!!$backdropEl) {
      $backdropEl.remove();
    }

    if ($attrs.absolute) {
      $dropdownEl.remove();
    }

    $dropdownEl = $dropdownMenuEl = $cloneEl = cloneEl = $backdropEl = null;
  });
}])

.directive('dropdown', [function() {
  return {
    restrict: 'EA',
    controller: 'EzDropdownCtrl',
    scope: {
      isOpen: '=?',
      clickInside: '=?',
      clickEvent: '=?',
      onToggle: '=?',
      toggleFn: '=?',
      absolute: '=?'
    },
    compile: function($el, attrs) {
      var $menu = $el.children().last().remove();

      $el.addClass('dropdown');
      $menu.addClass('dropdown-menu');

      return function(scope, $el, attrs, ctrl) {
        ctrl.init($el, $menu, attrs);
      };
    }
  };
}])

.directive('dropdownToggle', [function() {
  return {
    restrict: 'EA',
    require: '^dropdown',
    link: function(scope, $el, attrs, ctrl) {
      $el.addClass('dropdown-toggle');

      $el.on('click', function(e) {
        ctrl.toggle(e);

        scope.$apply();
      });
    }
  };
}]);


