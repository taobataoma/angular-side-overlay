# angular-side-overlay
angular-side-overlay is a component of angular 1, it can popup a overlay from the optional side, support opened &amp; closed method, and auto close when  ESC keydown, and modal options, and close on outside click options.

## Screenshot
![messages_box](https://user-images.githubusercontent.com/7778550/27896316-cd97a720-624b-11e7-9271-37fdf12a9be6.jpg)

## Install
To install the package using bower and save as a dependency use...
```bash
bower install angular-side-overlay --save
```

To install via NPM:
```bash
npm install angular-side-overlay --save
```

## Usage
In your html/template add
```html
...
  <link rel="stylesheet" href="angular-side-overlay.min.css">
...
  <script src="angular-side-overlay.min.js"></script>
...

```

In your application, declare dependency injection like so..

```javascript
  angular.module('modelName', ['ngSideOverlay']);
...
```
## Service

#### Service: "SideOverlay"

Methods:
1. open(event, id, callback)
1. close(event, id, callback)

tip: param `id` is the popup element id, if given `event` param, will auto run codes follow for you:
```javascript
    event.stopPropagation();
```

#### Directive: "side-overlay"

Values: `left, right, top, bottom`

Attrs:
1. `side-class`: user custom css class
1. `side-modal`: if given this attr will popup of modal with a half opacity background
1. `side-close-on-esc`: close popup when `ESC` keydown
1. `side-close-on-outside-click`: close popup when outside click of the overlay
1. `side-closed`: function, event occur when the popup is closed
1. `side-opened`: function, event occur when the popup is opened
1. `side-status`: value, set open or close status value for popup, if true, open the popup, if false, close the popup

## Two ways to open or close popup
1. Use the methods `open` or `close`
1. Set `side-status` attr to `true/false/variable`

## Example

HTML code
```html
<style>
    .popup-side-overlay {
        top: 50px !important;
        width: 450px;
    }
</style>
...
<button class="btn btn-default" onclick="openSideOverlay(event)">open</button>
<button class="btn btn-default" onclick="closeSideOverlay(event)">close</button>
...
<div id="popupSlide"
     side-overlay="right"
     side-class="popup-side-overlay"
     side-opened="onSideOpened()"
     side-closeed="onSideClosed()"
     side-status="sideStatus"
     side-modal side-close-on-esc side-close-on-outside-click>
    <div class="text-center">
        <h2>Angular Side Overlay</h2>
    </div>
</div>
```
Controller code
```javascript
  angular
    .module('messages')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['SideOverlay', '$timeout'];

  function MessageController(SideOverlay, $timeout) {

    $timeout(function () {
      $scope.popupStatus = true;
    }, 3000);

    $timeout(function () {
      $scope.popupStatus = false;
    }, 6000);

    function openSideOverlay(evt){
        SideOverlay.open(evt, 'popupSlide', function(){
            console.log('open callback runned');
        });
    }

    function closeSideOverlay(evt){
        SideOverlay.close(evt, 'popupSlide', function(){
            console.log('close callback runned');
        });
    }

    function onSideOpened() {
        console.log('side-opened runned');
    }

    function onSideClosed() {
        console.log('side-closeed runned');
    }
  }
```

## Online support
- Post an [issue](https://github.com/taobataoma/angular-side-overlay/issues)
- Email to [taobataoma](mailto:taobataoma@gmail.com)
- Join [QQ](http://im.qq.com/) Group: 291843550

## License
[The MIT License](LICENSE.md)
