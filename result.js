
function get_data() {
  console.log('get_data() *******....');
  chrome.storage.local.get('result', function(result) {
    console.log('Value currently is ' + result.key);
  });
}

document.addEventListener('DOMContentLoaded', function() {
   console.log('result.js *******....');
   //get_data();
   chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
       console.log('result.js message received...*******....');
   });
}, false);
