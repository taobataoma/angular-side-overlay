angular.module('ngSideOverlay', []);
angular.module('ngSideOverlay').constant('MODULE_VERSION', '1.0.3');
angular.module('ngSideOverlay').value('sideCallbackEvent', [
  {
    id: undefined,
    isOpened: false,
    openCallback: undefined,
    closeCallback: undefined
  }
]);

angular.module('ngSideOverlay').provider('SideOverlay', function () {
  this.$get = function (sideCallbackEvent) {
    //method open
    var open = function (evt, id, cb) {
      if (!id) {
        return;
      }
      addSide(id, true, cb, null);

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
    };

    //method close
    var close = function (evt, id, cb) {
      if (!id) {
        return;
      }
      addSide(id, false, null, cb);

      var e = angular.element(document.getElementById(id));
      if (e.hasClass('side-visible')) {
        e.removeClass('side-visible');
      }

      if (evt && typeof evt.altKey !== "undefined") {
        evt.stopPropagation();
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

    //add side
    function addSide(id, status, openc, closec) {
      var side = null;
      angular.forEach(sideCallbackEvent, function (e) {
        if (e.id === id) {
          side = e;
          e.isOpened = status;
          e.openCallback = openc;
          e.closeCallback = closec;
        }
      });
      if (side === null) {
        sideCallbackEvent.push({
            id: id,
            isOpened: status,
            openCallback: openc,
            closeCallback: closec
          }
        );
      }
    }

    return {
      isOpened: isOpened,
      open: open,
      close: close
    };
  };
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

    scope.$watch(attrs.sideOverlay, function (s) {
      switch (attrs.sideOverlay) {
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
          if (element.hasClass('side-visible')) {
            element.removeClass('side-visible');
          }
        });
      }
    });

    //overlay class
    scope.$watch(attrs.sideClass, function (s) {
      if (attrs.sideClass) {
        element.addClass(attrs.sideClass);
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
      var e = angular.element(evt.target);
      var bg = $('#sideBackground_' + element.attr('id'));
      var sideEvent = getSideEvent(e.attr('id'));

      if (sideEvent) {
        if (!e.hasClass('side-visible')) {
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

    function getSideEvent(id) {
      var ele = null;
      angular.forEach(sideCallbackEvent, function (e) {
        if (e.id === id) {
          ele = e;
        }
      });
      return ele;
    }
  }
}
