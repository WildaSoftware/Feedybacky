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
* **history** - array of objects representing last N events called by the user (details below). Available only if the user accepted sending history information.
* **extraInfo** - JSON object with extra parameters passed by the callback function. Available only if extra data callback was defined.
* **email** - e-mail address provided by the user if available (the appropriate field is visible).
* **prefix** - prefix defined for the Feedybacky instance (if defined).
* **adBlock** - information if an enabled AdBlock browser plugin can be detected. It can have value 1 or 0.

`texts` - JSON object with custom messages in different parts of the plugin. It can contain following keys:

* **tooltip** - information visible after placing the cursor on the minified div with the plugin.
* **title** - title on top of the plugin screen.
* **description** - description on the plugin screen (before textarea).
* **additionalDataInformation** - description on the plugin screen (after textarea, before checkboxes).
* **screenshot** - label for the checkbox to accept sending a screenshot.
* **metadata** - label for the checkbox to accept sending metadata.
* **history** - label for the checkbox to accept sending event history.
* **note** - label for the text between checkboxes and send button (empty by default and then not visible).
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

`metadataField` - optional parameter for defining behaviour of the plugin during processing metadata. The default value is `"visible"` and other possibilities are similar as for `screenshotField` above.

`historyField` - optional parameter for defining behaviour of the plugin during processing event history. The default value is `"visible"` and other possibilities are similar as for `screenshotField` above. Captured event types are: `change`, `click`, `focus`, `reset`, `submit` and there are omitted for Feedybacky form.

`historyLimit` - number of last event calls on the page which would be added to event history. The default value is not set what means that all captured operations would be sent.  

`beforeSubmit` - optional callback function with one parameter - instance of `FeedybackyPayload` object containing whole payload ready to sent. This callback is invoked before sending a request to endpoint defined by `onSubmitUrl` parameter. It can be used to make some preparations before sending (for example, show loader animation) or add some additional fields to payload, such as authentication key. The last one can be achieved by `add` function invoked inside `beforeSubmit`, e.g.:

```ts
beforeSubmit: (payload) => {
	alert('We are in beforeSubmit function and we add some fields to payload.');

	payload.add('param1', 'Value of additional parameter 1');
	payload.add('param2', 'Value of additional parameter 2');
}
```

`onSubmitUrlSuccess` - optional callback function invoked after successful request sending to endpoint defined by `onSubmitUrl` parameter. It has two parameters: `statusCode` and `response` (the latter is textual representation of response body).

`onSubmitUrlError` - optional callback function invoked after failed request sending to endpoint defined by `onSubmitUrl` parameter. It has two parameters: `statusCode` and `response` (the latter is textual representation of response body).

`prefix` - optional parameter with text added to each request. It can be useful to distinct request sent from one site but in various sets of configuration - it can be used as tag, label.

`alertAfterRequest` - optional parameter which indicates if the alter after sending a request should be visible. Value should be of boolean type - the default value is `true`.

`adBlockDetected` - optional parameter to pass information about AdBlock detection from an external script or tool. This paramter can be useful in situations where basic detector in Feedybacky is not sufficient.

`side` - optional parameter for determining side of the Feedybacky. Default value is `right` and means that the plugin is visible on the right side of the website. Another possible value is `left`.

`order` - optional parameter passing an order of the form elements. It should contain specific element identifiers divided by commas and can be also use to hide some parts. Default value is `"description,message,email,explanation,screenshot,metadata,history,note"`. 

`classes` - optional parameter which can be used to pass JSON object with keys as element identifiers and values with class names list for such element. Available keywords are `title, description, message, email, explanation, screenshot, metadata, history, note, send, powered`.

`expandMessageLink` - optional parameter to make expand link visible. If it is correct, the link is present under message input and causes expanding the message area and the whole form. The default value is `false`.

### Methods ###

After creating the Feedybacky object, some methods could be invoked on it:

`open` - immediate opening the container with Feedybacky form.

`close` - immediate closing the container with Feedybacky form.

### Wrappers ###

Feedybacky can be also useful in some systems which provide a module subsystem helping non-programmers to use various plugins. In `wrappers` directory there are wrappers with manuals for:

* Wordpress
* Drupal

They are very simple ports of the plugin to these systems (they can be developed if necessary) and can be used as well as standard form of Feedybacky.

### Authors ###

Feedybacky was created and is maintained by programmers of [Wilda Software](http://wildasoftware.pl/).

### Licence ###

Feedybacky is licenced under MIT licence.

