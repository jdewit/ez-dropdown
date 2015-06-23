angular.module('ez.dropdown', [])

.controller('DropdownCtrl', ['$scope', '$document', '$compile', function($scope, $document, $compile) {
  var isCompiled = false;
  var $dropdownEl;
  var $dropdownMenuEl;
  var $cloneEl;
  var cloneEl;
  var $backdropEl;
  var $attrs;

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
        $cloneEl = clone;
        cloneEl = clone[0];
        $dropdownEl.append(clone);
      });
    }

    if (!$attrs.mobileDisabled && !$dropdownEl.hasClass('dropdown-mobile')) {
      var w = $(window).width();
      if (w < 768) {

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

          if (!!$dropdownEl.hasClass('dropdown-select')) {
            $dropdownEl.find('li').each(function() {
              if (!$(this).hasClass('dropdown-header')) {
                if ($(this).hasClass('active')) {
                  $(this).append('<input type="radio" checked="checked"/>');
                } else {
                  $(this).append('<input type="radio"/>');
                }
              }
            });
          }
        });

        if (!$attrs.noBackdrop) {
          $backdropEl = angular.element('<div class="modal-backdrop in"></div>');
          $('body').append($backdropEl);
          $backdropEl.height($('body').height());
        }

        $dropdownEl.addClass('dropdown-mobile');
        $cloneEl.width(w - 40);
      } else {
        $dropdownEl.removeClass('dropdown-mobile');
      }
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

  var hide = function() {
    $dropdownEl.removeClass('open');

    if (typeof $scope.onToggle === 'function') {
      $scope.onToggle(false);
    }

    if (!!$backdropEl) {
      $backdropEl.remove();
    }

    $document.off('click', hideFn);
  };

  this.init = function(el, dropdownMenuEl, attrs) {
    $dropdownEl = el;
    $dropdownMenuEl = dropdownMenuEl.clone();
    $attrs = attrs;

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
    if (!!$backdropEl) {
      $backdropEl.remove();
    }

    $dropdownEl = $dropdownMenuEl = $cloneEl = cloneEl = $backdropEl = null;
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
      el.on('click', function(e) {
        ctrl.toggle();
        scope.$apply();
      });
    }
  };
}]);

