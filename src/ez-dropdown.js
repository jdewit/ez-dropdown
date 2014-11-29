angular.module('ez.dropdown', [])

.directive('dropdown', ['$document', '$compile', function($document, $compile) {
  return {
    restrict: 'C',
    compile: function(el, attrs) {
      var isRendered = false;
      var isShown = false;
      var dropdownEl = el;
      var dropdownToggleEl = angular.element(el[0].children[0]);
      var dropdownMenuEl = dropdownToggleEl.next().remove();
      var onToggle = typeof attrs.onToggle === 'function' ? attrs.onToggle : angular.noop;

      return function(scope) {
        var toggleMenu = function() {
          if (!isRendered) {
            dropdownEl.append($compile(dropdownMenuEl)(scope));
            isRendered = true;
          }

          if (isShown) {
            $document.off('click', documentClickHandler);

            dropdownEl.removeClass('open');
          } else {
            $document.on('click', documentClickHandler);

            dropdownEl.addClass('open');
          }

          isShown = !isShown;

          scope.$apply(function() {
            scope.$eval(attrs.onToggle)(isShown);
          });
        };

        var documentClickHandler = function(e) {
          if ( attrs.hasOwnProperty('clickInside') && dropdownMenuEl[0].contains(e.target) ) {
            return;
          }

          toggleMenu();
        };

        var dropdownToggleClickHandler = function(e) {
          e.preventDefault();
          e.stopPropagation();

          toggleMenu();
        };


        dropdownToggleEl.bind('click', dropdownToggleClickHandler);
      };
    }
  };
}]);

