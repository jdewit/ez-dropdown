angular.module('ez.dropdown', [])

.constant('EzDropdownConfig', {

  /**
   * Width in px to break into mobile mode
   */
  mobileThreshold: 768,

  /**
   * Enable mobile mode, makes menu full width
   */
  mobileEnabled: true,

  /**
   * Prevent dropdown from closing when the user clicks inside the dropdown menu element
   */
  clickInside: false,

  /**
   * Absolutely position the dropdown
   */
  absolute: false,

  /**
   * get item name function
   */
  getNameFn: function(item) {
    return item.name;
  },

  /**
   * Drilldown enabled
   */
  drilldownEnabled: true,

  /**
   * Mobile drilldown enabled
   */
  mobileDrilldownEnabled: true,

  /**
   * Mobile backdrop enabled
   */
  backdropEnabled: true,

  /**
   * Show dropdown menu pointer
   */
  dropdownPointer: true

})

.controller('EzDropdownCtrl', [
  'EzDropdownConfig',
  '$scope',
  '$document',
  '$parse',
  '$compile',
  '$timeout',
  '$templateCache',
  '$location',
  function(
    Config,
    $scope,
    $document,
    $parse,
    $compile,
    $timeout,
    $templateCache,
    $location
  ) {

    var isCompiled = false;
    var isDynamic;
    var $dropdownEl;
    var $dropdownMenuEl;
    var dropdownMenuEl;
    var $backdropEl;
    var self = this;

    function resolveMenuVariables() {
      if ($scope.options.mobileEnabled && window.innerWidth < $scope.options.mobileThreshold) {
        $scope.menu.isMobile = true;
      }

      if (isDynamic) {
        if ($scope.menu.isMobile) {
          $scope.menu.isDrilldown = $scope.options.mobileDrilldownEnabled;
        } else {
          $scope.menu.isDrilldown = $scope.options.drilldownEnabled;
        }
      } else {
        $scope.menu.isDrilldown = false;
      }

      if ($scope.menu.isDrilldown) {
        $scope.menu.clickInside = true;
      } else {
        $scope.menu.clickInside = $scope.options.clickInside;
      }
    }

    /**
     * Places menu in middle if in mobile mode and not in drilldown
     */
    function positionMenu() {
      if ($scope.menu.isMobile) {
        var top = 20;

        if (!$scope.menu.isDrilldown) {
          var diff = $dropdownMenuEl.height() - window.innerHeight;

          if (diff < 0) {
            top = -diff / 2;
          }
        }

        $dropdownMenuEl.css({
          width: window.innerWidth - 40,
          maxHeight: window.innerHeight - 20,
          top: top
        });
      } else {
        $dropdownMenuEl.css({
          width: 'auto',
          top: ''
        });
      }
    }

    function hideFn(e) {
      if (!!e && e.type === 'keyup') {
        if (e.which === 27) {
          // close on Esc press
          $scope.isOpen = false;
          $scope.$apply();
        }
      } else if (!!e && !!$scope.menu.clickInside && !!dropdownMenuEl && dropdownMenuEl.contains(e.target)) {
        // allow click inside
        setTimeout(function() {
          $document.one('click', hideFn);
        });
      } else {
        $scope.isOpen = false;
        $scope.$apply();
      }
    }

    function setInitialItem() {
      $scope.menu.openItem = null;

      if (!!$scope.menu.activeItem) {
        $scope.menu.activeItemId = $scope.menu.activeItem.id;
      } else {
        $scope.menu.activeItem = null;
      }

      for (var i = 0, l = $scope.menu.items.length; i < l; i++) {
        if ($scope.menu.items[i].hasOwnProperty('conditional')) {
          if (typeof $scope.menu.items[i].conditional !== 'boolean') {
            console.log($scope.$parent.user);
            console.log($scope.menu.items[i].conditional);
            console.log($scope.$parent.$eval($scope.menu.items[i].conditional));
            $scope.menu.items[i].conditional = $scope.$parent.$eval($scope.menu.items[i].conditional);
          }
        } else {
          $scope.menu.items[i].conditional = true;
        }

        if ($scope.menu.items[i].id === $scope.menu.activeItemId) {
          $scope.menu.activeItem = $scope.menu.items[i];
          $scope.menu.activeItem.active = true;
        }

        if (!!$scope.menu.items[i].items) {
          for (var j = 0, k = $scope.menu.items[i].items.length; j < k; j++) {
            $scope.menu.items[i].items[j].parent = $scope.menu.items[i];

            if ($scope.menu.items[i].items[j].hasOwnProperty('conditional')) {
              if (typeof $scope.menu.items[i].items[j].conditional !== 'boolean') {
                $scope.menu.items[i].items[j].conditional = $scope.$parent.$eval($scope.menu.items[i].items[j].conditional);
              }
            } else {
              $scope.menu.items[i].items[j].conditional = true;
            }

            if ($scope.menu.items[i].items[j].id === $scope.menu.activeItemId) {
              $scope.menu.activeItem = $scope.menu.items[i].items[j];
              $scope.menu.openItem = $scope.menu.activeItem.parent;
              $scope.menu.activeItem.active = true;
              $scope.menu.openItem.open = true;
            }
          }
        }
      }
    }

    this.compileDropdownMenu = function(isTranscluded) {
      isCompiled = true;

      if (!$dropdownMenuEl) {
        $dropdownMenuEl = angular.element($templateCache.get('ez-dropdown-menu.html'));
        dropdownMenuEl = $dropdownMenuEl[0];
      }

      // must clone content so it does not get overwritten
      $compile($dropdownMenuEl.clone())(isDynamic ? $scope : $scope.$parent, function(clone) {
        $dropdownMenuEl = clone;
        dropdownMenuEl = clone[0];

        if ($scope.options.absolute) {
          $dropdownEl = angular.element('<span class="dropdown dropdown-absolute"></span>');
          $dropdownEl.append($dropdownMenuEl);

          $('body').append($dropdownEl);
        } else {
          $dropdownEl.append($dropdownMenuEl);
        }
      });
    };

    this.show = function() {

      if (!isCompiled) {
        this.compileDropdownMenu();
      }

      resolveMenuVariables();

      $('body').addClass('modal-open');

      if ($scope.menu.isMobile) {
        $('body').addClass('mobile-modal-open');

        // allow menu height to take effect
        setTimeout(function() {
          positionMenu();
        });

        if ($scope.options.backdropEnabled) {
          $backdropEl = angular.element('<div class="modal-backdrop fade in"></div>');
          $('body').append($backdropEl);
        }

        $dropdownEl.addClass('dropdown-mobile');
      } else {
        positionMenu();
      }

      if (!!$scope.options.absolute && $scope.clickEvent) {
        var top = $scope.clickEvent.clientY + $(document).scrollTop();
        var left;
        var menuWidth = $dropdownMenuEl.width();

        if (($scope.clickEvent.clientX + menuWidth) > window.innerWidth) {
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
        $document.one('keyup', hideFn);
      });
    };

    this.hide = function() {
      $dropdownEl.removeClass('open');

      if ($scope.menu.isMobile) {
        $dropdownEl.removeClass('dropdown-mobile');

        $dropdownMenuEl.css({
          top: 'auto',
          width: 'auto'
        });
      }

      if (typeof $scope.onToggle === 'function') {
        $scope.onToggle(false);
      }

      if (!!$backdropEl) {
        $backdropEl.remove();
      }

      $('body').removeClass('modal-open mobile-modal-open');

      $document.off('click', hideFn);
    };

    this.toggle = function(e) {
      $scope.clickEvent = e;
      $scope.isOpen = !$scope.isOpen;
    };

    /**
     * Resolve options from EzDropdownConfig, scope.ezConfig, and attrs
     */
    this.resolveOptions = function(attrs) {
      // resolve config
      $scope.options = angular.extend({}, Config, $scope.ezConfig);

      // allow config to be set via attrs
      for (var option in Config) {
        if (attrs.hasOwnProperty(option)) {
          if (typeof Config[option] === 'boolean' || typeof Config[option] === 'function') {
            $scope.options[option] = $parse(attrs[option])($scope.$parent);
          } else {
            $scope.options[option] = attrs[option];
          }
        }
      }
    };

    /**
     * Initialize dropdown element
     */
    this.init = function($el, $menu) {
      $dropdownEl = $el;

      if (!!$menu) {
        $dropdownMenuEl = $menu;
        dropdownMenuEl = $menu[0];
        $scope.menu = {};
      } else {
        isDynamic = true;
      }

      $scope.toggleFn = self.toggle;

      resolveMenuVariables();

      if (isDynamic && (!!$scope.menu.activeItemId || !!$scope.menu.activeItem)) {
        setInitialItem();
      }
    };

    $scope.select = function(item, isSub) {
      if (isSub) {
        item.active = !item.active;

        if (item.active) {
          if (!!$scope.menu.activeItem) {
            $scope.menu.activeItem.active = false;
          }

          $scope.menu.activeItem = item;
        } else {
          delete $scope.menu.activeItem;
        }
      } else {
        if ($scope.menu.isDrilldown && !!item.items) {
          item.open = !item.open;

          if (item.open) {
            if ($scope.menu.openItem) {
              $scope.menu.openItem.open = false;
            }

            $scope.menu.openItem = item;
          } else {
            delete $scope.menu.openItem;
          }
        } else {
          item.active = !item.active;

          if (item.active) {
            if ($scope.menu.activeItem) {
              $scope.menu.activeItem.active = false;
            }

            $scope.menu.activeItem = item;
          } else {
            delete $scope.menu.activeItem;
          }
        }
      }

      if (item.active) {
        if (!!item.href) {
          $timeout(function() {
            $scope.isOpen = false;

            $location.path(item.href);
          }, 400);
        }
      }

      if (typeof $scope.onSelect === 'function') {
        $scope.onSelect($scope.menu.activeItem, $scope.menu.openItem);
      }
    };

    $scope.$watch('menu.activeItemId', function(n, o) {
      if (n !== o) {
        setInitialItem();
      }
    });

    $scope.$watch('isOpen', function(n, o) {
      if (n !== o) {
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

      if ($scope.options.absolute) {
        $dropdownEl.remove();
      }

      $dropdownEl = $dropdownMenuEl = dropdownMenuEl = $backdropEl = null;
    });
  }
])

.directive('dropdown', [
  'EzDropdownConfig',
  function(
    Config
  ) {
    return {
      restrict: 'EA',
      controller: 'EzDropdownCtrl',
      scope: {
        menu: '=?',
        isOpen: '=?',
        clickEvent: '=?',
        onToggle: '=?',
        onSelect: '=?',
        toggleFn: '=?',
        ezConfig: '=?'
      },
      compile: function($el, attrs) {
        $el.addClass('dropdown');

        var $menu;

        if (!attrs.hasOwnProperty('menu')) {
          $menu = $el.children().last().remove().addClass('dropdown-menu');
        }

        return function(scope, $el, attrs, ctrl) {
          scope._scope = scope.$parent;

          ctrl.resolveOptions(attrs);

          ctrl.init($el, $menu);
        };
      }
    };
  }
])

.directive('dropdownToggle', [function() {
  return {
    restrict: 'A',
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
