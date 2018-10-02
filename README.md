# Warmly Extension
This extension is for entering search criteria and displaying the results of the _Warmly_ service. See: https://brianlee389.github.io/WarmlyLandingPage/index.html

## Implementation
### manifest.json
This is the main configuration file for the extension, it designates _content scripts_ which are injected into the context of the running page. For details see:
https://developer.chrome.com/extensions/manifest

### Content Scripts
Due to the security model of the chrome extension architecture, the so-called "isolated worlds", calling a web service and displaying the results in a _separate_ popup is not straight forward - the various participating pieces (foreground/background scripts and page document) can't access the global variable spaces of each other, so you need to use the chrome API messaging. For details, see:
https://developer.chrome.com/extensions/content_scripts
https://developer.chrome.com/extensions/messaging

##### main.js
This script injects the "warm" button on the composer popup and also launch the search criteria input dialog upon pressing the "warm" button. When the "Ok" button is pressed on the search dialog, a web service call is made to the warmly web service; when the result comes back, it is sent to the background script via chrome messaging. For the web calls, I wanted to use `fetch/promises` API, but I got jQuery `.ajax(...)` working first, so I went with that for now.
This is the "foreground" script.  

##### background.js
This script listens for messages coming from the foreground script, `main.js` and displays the results in a popup defined by `result.html`, `result.js` and `result.css`, note due the chrome security model, the `result.html` could not have in-line `style` or `script` tags (best practice to externalize anyway).

#### Dependencies
+ https://api.jquery.com/
+ https://github.com/KartikTalwar/gmail.js
+ https://selectize.github.io/selectize.js/


**N.B.** I was not able to get messaging working without explicitly opening a port with the extension id parameter.  In that case, it is essential to "freeze" the extension id, otherwise a new, random id is generated each time the extension is published. See:
https://stackoverflow.com/questions/21497781/how-to-change-chrome-packaged-app-id-or-why-do-we-need-key-field-in-the-manifest#21500707

https://developer.chrome.com/extensions/manifest/key



## Installation
### Install from Chrome Web Store
Navigate to: https://chrome.google.com/webstore/detail/warmly/papmjbnpmffiahcnakjfjoobkefaemii/

Then press the "Add To Chrome" button.

### Install via source in Developer Mode
To load from checked out code, enable "Developer Mode" in the `chrome://extensions` page.  Then do:

In Chrome, from the menu, select "More Tools", then "Extensions".  The extensions page will come up.  
Click on "LOAD UNPACKED" and select this directory.  The "Warmly" button should appear when the page
https://mail.google.com is loaded.

### Local `HTTP` serving static test `JSON`
The Python based `SimpleHTTPServer` doesn't seem to work when requesting from a chrome extension.  I found that the _NodeJS_ package, [http-server](https://www.npmjs.com/package/http-server) works, however, possibly due to being able to enable CORS easily from the command line.  The following instructions assume you have _node_ and _npm_ installed.

```
# cd test
$ npm install http-server -g
$ http-server --cors
```
