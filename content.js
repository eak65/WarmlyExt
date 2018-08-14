
var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.10.2.min.js');
(document.head || document.documentElement).appendChild(j);

var g = document.createElement('script');
g.src = chrome.extension.getURL('gmail.js');
(document.head || document.documentElement).appendChild(g);

var sel  = document.createElement('script');
sel.src = chrome.extension.getURL('selectize.js');
(document.head || document.documentElement).appendChild(sel);

var hi = document.createElement('script');
hi.src = chrome.extension.getURL('jquery.highlight-within-textarea.js');
(document.head || document.documentElement).appendChild(hi);

var s = document.createElement('script');
s.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(s);
