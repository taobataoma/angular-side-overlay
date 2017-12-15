angular.module('ngSideOverlay', []);
angular.module('ngSideOverlay').constant('MODULE_VERSION', '1.1.4');
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
        sideEvent.openCallback = cb;
        sideEvent.closeCallback = null;

        var e = angular.element(document.getElementById(id));
        if (!e.hasClass('side-visible')) {
          e.addClass('side-visible');
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
        sideEvent.openCallback = null;
        sideEvent.closeCallback = cb;

        var e = angular.element(document.getElementById(id));
        if (e.hasClass('side-visible')) {
          e.removeClass('side-visible');
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
sideOverlay.$inject = ['sideCallbackEvent', 'SideOverlay', '$timeout'];
function sideOverlay(sideCallbackEvent, SideOverlay, $timeout) {
  var directive = {
    restrict: 'A',
    link: link
  };

  return directive;

  function link(scope, element, attrs) {
    element.addClass('side-overlay');

    addSideEvent(element.attr('id'));
    var sideEvent = getSideEvent(element.attr('id'));
    var sideClassDefault = 'side-class-default-right';

    scope.$watch(attrs.sideOverlay, function (s) {
      sideEvent.position = attrs.sideOverlay;
      sideClassDefault = 'side-class-default' + '-' + sideEvent.position;
      element.addClass(sideClassDefault);

      switch (sideEvent.position) {
        case 'left':
          element.css('top', '0');
          element.css('bottom', '0');
          element.css('left', '0');
          element.css('transform', 'translateX(-101%) translateY(0)');
          break;
        case 'right':
          element.css('top', '0');
          element.css('bottom', '0');
          element.css('right', '0');
          element.css('transform', 'translateX(101%) translateY(0)');
          break;
        case 'top':
          element.css('left', '0');
          element.css('right', '0');
          element.css('top', '0');
          element.css('transform', 'translateX(0) translateY(-101%)');
          break;
        case 'bottom':
          element.css('left', '0');
          element.css('right', '0');
          element.css('bottom', '0');
          element.css('transform', 'translateX(0) translateY(101%)');
          break;
        default:
          element.css('top', '0');
          element.css('bottom', '0');
          element.css('right', '0');
          element.css('transform', 'translateX(101%) translateY(0)');
          break;
      }

      $timeout(function () {
        element.css('transition', 'all .3s ease-out');
      }, 100);
    });

    //overlay class
    scope.$watch(attrs.sideClass, function (s) {
      if (attrs.sideClass) {
        element.addClass(attrs.sideClass);
      }
    });

    //sideModal
    scope.$watch(attrs.sideModal, function (s) {
      if (attrs.hasOwnProperty('sideModal')) {
        var id = 'sideBackground_' + element.attr('id');
        var be = angular.element('<div id="' + id + '" class="side-background" style="display: none;"></div>');
        angular.element(document.getElementsByTagName('body')).append(be);
      }
    });

    //sideStatus
    scope.$watch(attrs.sideStatus, function (s) {
      if (attrs.hasOwnProperty('sideStatus')) {
        if (s) {
          SideOverlay.open(null, sideEvent.id, null);
        } else {
          SideOverlay.close(null, sideEvent.id, null);
        }
      }
    });

    //sideCloseOnOutsideClick
    scope.$watch(attrs.sideCloseOnOutsideClick, function (s) {
      if (attrs.hasOwnProperty('sideCloseOnOutsideClick')) {
        $(document.body).on('click', function (e) {
          if (e.target.tagName !== 'BODY') {
            if (element.hasClass('side-visible')) {
              element.removeClass('side-visible');
            }
          }
        });
      }
    });

    //document keydown (ESC close)
    scope.$watch(attrs.sideCloseOnEsc, function (s) {
      if (attrs.hasOwnProperty('sideCloseOnEsc')) {
        $(document).on('keydown', function (e) {
          if (e.keyCode === 27) { // ESC
            if (element.hasClass('side-visible')) {
              element.removeClass('side-visible');
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
        if (!element.hasClass('side-visible')) {
          if (bg) {
            bg.css('display', 'none');
          }
          if (typeof sideEvent.closeCallback === 'function') {
            scope.$apply(function () {
              sideEvent.closeCallback();
            });
          }
          scope.$apply(function () {
            if (sideEvent.isOpened) {
              scope.$eval(attrs.sideClosed);
            }
          });
          sideEvent.isOpened = false;
          $(document.body).focus();
        } else {
          if (typeof sideEvent.openCallback === 'function') {
            scope.$apply(function () {
              sideEvent.openCallback();
            });
          }
          scope.$apply(function () {
            if (!sideEvent.isOpened) {
              scope.$eval(attrs.sideOpened);
            }
          });
          sideEvent.isOpened = true;
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
