console.log('*******....');

function get_data() {
  console.log('*******....');
  chrome.storage.local.get(['result'], function(result) {
    console.log('Value currently is ' + result.key);
  });
}

get_data();
