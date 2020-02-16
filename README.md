Feedybacky
==========

### What is Feedybacky? ###

Feedybacky is simple JS plugin for web pages which facilitates feedback system. It creates a sliding element on HTML page in which an user can provide a request (error, suggest, comment etc.) and send it in rapid and easy way. The special part of this process is the fact, that Feedybacky allows to attach a screenshot of the current page and additional information **automatically**. It includes i.a. current URL, user agent string and - of course - current datetime. In many situations, request's text provided by a user is not sufficient to reproduce e.g. an error - Feedybacky tries to solve that problem.

Feedybacky uses `html2canvas` library created by Niklas von Hertzen.

### Installation ###

If you just want to use Feedybacky, you can copy the ZIP archive from the repository and unzip to the destinated directory. It is important to have all subfolders (`css`, `js` etc.) next to each other in the same folder.

Of course, you can also install Feedybacky as NPM package:

	npm install --save feedybacky

If you want to modify or build Feedybacky by yourself, you should install NPM dependencies by running `npm install` command, install `gulp-cli` globally (`npm install -g gulp-cli`) and run `gulp` in Feedybacky directory (`npm install gulp`). Afterwards, you can copy following directories to the destinated folder: `css`, `dependencies`, `i18n`, `img`, `js`.

### How to include Feedybacky in my web page? ###

#### Standard way ####

Firstly, you have to create a DOM element anywhere on your web page:
```html
<div id="feedybacky-container"></div>
```	
Secondly, Feedybacky script should be included and its object initialized:
```javascript
<script type="text/javascript" src="js/feedybacky.min.js"></script>
//...
var feedybacky = new Feedybacky('feedybacky-container', {
	onSubmitUrl: url
});
```
#### Angular ####

1. Add a DOM element to your root `.html` template (outside `<app-root></app-root>`):
```html
<div id="feedybacky-container"></div>
```
2. Edit your `angular.json` file:
```json
//...
"build": {
	//...
	{
		"styles": [
			//...
			"node_modules/feedybacky/css/feedybacky.min.css"
		],
		"scripts": [
			//...
			"node_modules/feedybacky/dependencies/html2canvas/html2canvas.min.js"
		]
	}
}
```
3. In your `app.component.ts` add:
```typescript
import { Feedybacky } from 'feedybacky';

export class AppComponent {
	protected feedybacky = new Feedybacky('feedybacky-container', {
		onSubmitUrl: url
	});
	//...
}
```
#### Vue.js ####
1. Add a DOM element to `public/index.html`:
```html
<div id="feedybacky-container"></div>
```
2. Import Feedybacky into `App.vue`:
```ts
import { Feedybacky } from 'feedybacky'

const feedybacky = new Feedybacky('feedybacky-container', {
  onSubmitUrl: url
});
```
3. Import additional styles and dependencies in `main.js`:
```ts
import 'feedybacky/css/feedybacky.min.css';
import 'feedybacky/dependencies/html2canvas/html2canvas.min.js';
```

#### React ####
1. Add DOM element to `public/index.html`:
```html
<div id="feedybacky-container"></div>
```
2. Import and init Feedybacky and import dependencies into `App.js`
```ts
import { Feedybacky } from 'feedybacky';
import 'feedybacky/css/feedybacky.min.css';
import 'feedybacky/dependencies/html2canvas/html2canvas.min.js';

new Feedybacky('feedybacky-container', {
  onSubmitUrl: url
})
```

### Parameters ###

In Feedybacky constructor, next to ID of empty div, a JSON object with parameters should be provided. Below there are parameters accepted by Feedybacky.

`language` - language in which Feedybacky should display default messages. Can be omitted, especially if custom messages are provided. Available language packs with default messages can be found in `i18n` directory. Default value: `"en"`

`onSubmit` - callback function to invoke after sending a request. Either `onSubmit` or `onSubmitUrl` parameter must be set. This parameter is for advanced usage only - in most cases `onSubmitUrl` would be the better choice.

`onSubmitUrl` - URL with POST web service to receive information about a sent request. The resulted JSON object can consist of following fields:

* **message** - text provided by the user.
* **timestamp** - date and time of the request creation.
* **url** - URL on which the request is sent.
* **errors** - array with error messages from JavaScripts's console.
* **image** - screenshot of the current web page. Available only if the user accepted sending a screenshot.
* **agent** - user agent string. Available only if the user accepted sending metadata information.
* **cookies** - current user's cookie string. Available only if the user accepted sending metadata information.
* **platform** - platform symbol of the user's machine. Available only if the user accepted sending metadata information.
* **screenSize** - size of the screen (result of `screen.width` and `screen.height`). Available only if the user accepted sending metadata information.
* **availableScreenSize** - size of available part of the screen (result of `screen.availWidth` and `screen.availHeight`). Available only if the user accepted sending metadata information.
* **innerSize** - size of visible frame (result of `window.innerWidth` and `window.innerHeight`). Available only if the user accepted sending metadata information.
* **colorDepth** - depth of the pixel on the screen (result of `screen.colorDepth`). Available only if the user accepted sending metadata information.
* **orientation** - screen orientation (result of `screen.orientation.type;`). Available only if the user accepted sending metadata information.
* **extraInfo** - JSON object with extra parameters passed by the callback function. Available only if extra data callback was defined.
* **email** - e-mail address provided by the user if available (the appropriate field is visible).

`texts` - JSON object with custom messages in different parts of the plugin. It can contain following keys:

* **tooltip** - information visible after placing the cursor on the minified div with the plugin.
* **title** - title on top of the plugin screen.
* **description** - description on the plugin screen (before textarea).
* **additionalDataInformation** - description on the plugin screen (after textarea, before checkboxes).
* **screenshot** - label for the checkbox to accept sending a screenshot.
* **metadata** - label for the checkbox to accept sending metadata.
* **send** - label for the "Send" button.
* **requestSuccess** - message visible after successful POST request sending.
* **requestFail** - message visible after unsuccessful POST request sending.
* **powered** - message on bottom of the plugin screen.
* **error404** - message after a situation where an 404 error occurred.
* **error500** - message after a situation where an 500 error occurred.
* **descriptionErrorEmpty** - error message for the empty description field.
* **email** - label before the e-mail address field.
* **emailErrorEmpty** - error message for the empty e-mail address field.

`extraInfo` - optional callback function with no parameter which only returns JSON object. Keys and values of the object are merged with standard request information (next to "message", "timestamp" etc.). It can be used to pass extra data specific to the web application, such as user ID.

`emailField` - optional parameter indicating if e-mail address field should be visible. If it is visible, it is also required. Default value: `false`.

`screenshotField ` - optional parameter for defining behaviour of the plugin during processing a screenshot. The default value is `"visible"` and it means that the checkbox is visible and a user can select if they would like to send a screenshot or not. The other possible values are `"autoEnable"` (the checkbox is not visible and the screenshot is sent automatically) and `"autoDisable"` (the checkbox is not visible and the screenshot is ignored).

`metadataField` - optional parameter for defining behaviours of the plugin during processing metadata. The default value is `"visible"` and other possibilities are similar as for `screenshotField` above.

### Authors ###

Feedybacky was created and is maintained by programmers of [Wilda Software](http://wildasoftware.pl/).

### Licence ###

Feedybacky is licenced under MIT licence.

