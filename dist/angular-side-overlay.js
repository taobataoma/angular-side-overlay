/**
 * angular-side-overlay - angular side overlay component
 * @author taobataoma
 * @version v1.1.0
 * @link https://github.com/taobataoma/angular-side-overlay#readme
 * @license MIT
 */
angular.module('ngSideOverlay', []);
angular.module('ngSideOverlay').constant('MODULE_VERSION', '1.1.0');
angular.module('ngSideOverlay').value('sideCallbackEvent', [
  {
    id: undefined,
    isOpened: false,
    openCallback: undefined,
    closeCallback: undefined,
    position: 'right'
  }
]);

angular.module('ngSideOverlay').provider('SideOverlay', function () {
  this.$get = ["sideCallbackEvent", function (sideCallbackEvent) {
    //method open
    var open = function (evt, id, cb) {
      if (!id) {
        return;
      }

      var sideEvent = getSideEvent(id);
      if (sideEvent) {
        sideEvent.isOpened = true;
        sideEvent.openCallback = cb;
        sideEvent.closeCallback = null;

        var e = angular.element(document.getElementById(id));
        var c = 'side-visible' + '-' + sideEvent.position;
        if (!e.hasClass(c)) {
          e.addClass(c);
        }

        var bg = $('#sideBackground_' + id);
        if (bg) {
          bg.css('display', 'block');
        }

        if (evt && typeof evt.altKey !== "undefined") {
          evt.stopPropagation();
        }
      }
    };

    //method close
    var close = function (evt, id, cb) {
      if (!id) {
        return;
      }

      var sideEvent = getSideEvent(id);
      if (sideEvent) {
        sideEvent.isOpened = false;
        sideEvent.openCallback = null;
        sideEvent.closeCallback = cb;

        var e = angular.element(document.getElementById(id));
        var c = 'side-visible' + '-' + sideEvent.position;
        if (e.hasClass(c)) {
          e.removeClass(c);
        }

        if (evt && typeof evt.altKey !== "undefined") {
          evt.stopPropagation();
        }
      }
    };

    //get status
    var isOpened = function (id) {
      var status = false;
      angular.forEach(sideCallbackEvent, function (e) {
        if (e.id === id) {
          status = e.isOpened;
        }
      });
      return status;
    };

    function getSideEvent(id) {
      var ele = null;
      angular.forEach(sideCallbackEvent, function (e) {
        if (e.id === id) {
          ele = e;
        }
      });
      return ele;
    }

    return {
      isOpened: isOpened,
      open: open,
      close: close
    };
  }];
});

angular.module('ngSideOverlay').directive('sideOverlay', sideOverlay);
sideOverlay.$inject = ['sideCallbackEvent'];
function sideOverlay(sideCallbackEvent) {
  var directive = {
    restrict: 'A',
    link: link
  };

  return directive;

  function link(scope, element, attrs) {
    element.addClass('side-overlay');

    addSideEvent(element.attr('id'));
    var sideEvent = getSideEvent(element.attr('id'));
    var visibleClass = 'side-visible-right';
    var sideClassDefault = 'side-class-default-right';

    scope.$watch(attrs.sideOverlay, function (s) {
      sideEvent.position = attrs.sideOverlay;
      visibleClass = 'side-visible' + '-' + sideEvent.position;
      sideClassDefault = 'side-class-default' + '-' + sideEvent.position;

      function initSideOverlay(v) {
        var w = element.prop('clientWidth') * 1.01;
        var h = element.prop('clientHeight') * 1.01;
        switch (sideEvent.position) {
          case 'left':
            element.css('top', '0');
            element.css('bottom', '0');
            element.css('left', '-' + w + 'px');
            break;
          case 'right':
            element.css('top', '0');
            element.css('bottom', '0');
            element.css('right', '-' + w + 'px');
            break;
          case 'top':
            element.css('left', '0');
            element.css('right', '0');
            element.css('top', '-' + h + 'px');
            break;
          case 'bottom':
            element.css('left', '0');
            element.css('right', '0');
            element.css('bottom', '-' + h + 'px');
            break;
          default:
            element.css('top', '0');
            element.css('bottom', '0');
            element.css('right', '-' + w + 'px');
            break;
        }
      }

      //overlay class
      scope.$watch(attrs.sideClass, function (s) {
        if (attrs.sideClass) {
          element.addClass(attrs.sideClass);
        } else {
          element.addClass(sideClassDefault);
        }
        initSideOverlay();
      });
    });

    //sideModal
    scope.$watch(attrs.sideModal, function (s) {
      if (attrs.hasOwnProperty('sideModal')) {
        var id = 'sideBackground_' + element.attr('id');
        var be = angular.element('<div id="' + id + '" class="side-background" style="display: none;"></div>');
        angular.element(document.getElementsByTagName('body')).append(be);
      }
    });

    //sideCloseOnOutsideClick
    scope.$watch(attrs.sideCloseOnOutsideClick, function (s) {
      if (attrs.hasOwnProperty('sideCloseOnOutsideClick')) {
        $(document.body).on('click', function (e) {
          if (element.hasClass(visibleClass)) {
            element.removeClass(visibleClass);
          }
        });
      }
    });

    //document keydown (ESC close)
    scope.$watch(attrs.sideCloseOnEsc, function (s) {
      if (attrs.hasOwnProperty('sideCloseOnEsc')) {
        $(document).on('keydown', function (e) {
          if (e.keyCode === 27) { // ESC
            if (element.hasClass(visibleClass)) {
              element.removeClass(visibleClass);
            }
          }
        });
      }
    });

    //sideOpened & sideClosed event
    element.bind('click', function (evt) {
      evt.stopPropagation();
    });

    //sideOpened & sideClosed event
    element.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function (evt) {
      var bg = $('#sideBackground_' + element.attr('id'));
      if (sideEvent && evt.target.id === sideEvent.id) {
        if (!element.hasClass(visibleClass)) {
          if (bg) {
            bg.css('display', 'none');
          }
          sideEvent.isOpened = false;
          if (typeof sideEvent.closeCallback === 'function') {
            scope.$apply(function () {
              sideEvent.closeCallback();
            });
          }
          scope.$apply(function () {
            scope.$eval(attrs.sideClosed);
          });
        } else {
          sideEvent.isOpened = true;
          if (typeof sideEvent.openCallback === 'function') {
            scope.$apply(function () {
              sideEvent.openCallback();
            });
          }
          scope.$apply(function () {
            scope.$eval(attrs.sideOpened);
          });
        }
      }
    });

    /**
     * getSideEvent
     * @param id
     * @returns {*}
     */
    function getSideEvent(id) {
      var ele = null;
      angular.forEach(sideCallbackEvent, function (e) {
        if (e.id === id) {
          ele = e;
        }
      });
      return ele;
    }

    /**
     * addSideEvent
     * @param id
     */
    function addSideEvent(id) {
      if (!getSideEvent(id)) {
        sideCallbackEvent.push({
            id: id,
            isOpened: false,
            position: 'right',
            openCallback: null,
            closeCallback: null
          }
        );
      }
    }
  }
}
