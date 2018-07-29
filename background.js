// Handle requests for passwords
console.log('*** Background: started');
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    console.log('*** Background: ' + request);
    if (request.type === 'display_warmly_result') {
        chrome.tabs.create({
            url: chrome.extension.getURL('result.html'),
            active: true
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width: 640,
                height: 480
            });
         
            var ldata = {"foo": {"bar":"baz"}};

            chrome.storage.local.set({"result": ldata}, function() {
                console.log('Value is set to ' + ldata);
            });
      
            /*chrome.tabs.executeScript(tab.id, {code:"var x = 10; x"}, function(results) { 
                const lastErr = chrome.runtime.lastError;
                if (lastErr) console.log('tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr));
                console.log('tab: ' + tab.id + ', ' + results); 
                console.log('results: ' + results); 
            });*/
        });
    }
});

function setResult(result) {
    console.log(result);
};
