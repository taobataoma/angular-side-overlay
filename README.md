# angular-side-overlay
angular-side-overlay is a component of angular 1, it can popup a overlay from the optional side, support opened &amp; closed method, and auto close when  ESC keydown, and modal options, and close on outside click options.

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
    event.preventDefault();
```

#### Directive: "side-overlay"

Values: `left, right, top, bottom`

Attrs:
1. `side-class`: user custom css class
1. `side-modal`: if given this attr will popup of modal with a half opacity background
1. `side-close-on-esc`: close popup when `ESC` keydown
1. `side-close-on-outside-click`: close popup when outside click of the overlay
1. `side-closed`: event occur when the popup is closed
1. `side-opened`: event occur when the popup is opened


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

  MessageController.$inject = ['SideOverlay'];

  function MessageController(SideOverlay) {

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
