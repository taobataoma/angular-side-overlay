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

Module name: "ngSideOverlay"

Service: "SideOverlay"

Directive: "side-overlay"

## License
[The MIT License](LICENSE.md)
