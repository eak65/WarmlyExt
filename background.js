// Handle requests for result popup
console.log('*** Background: started');
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    console.log('*** Background: ' + request);
    if (request.type === 'display_warmly_result') {
        chrome.tabs.create({
            url: chrome.extension.getURL('result.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
        });
    }
});

function setResult(result) {
    console.log(result);
};
