function render_row(row_data) {
  var row = $("<tr/>");
  $("#warmly_results").append(row);
  row.append($("<td>" + row_data['published date'].substring(0,16) + " keywords: \"" 
    + row_data.keywords.join(",") + "\"<br/>" + row_data.summary + "</td>"));
}

document.addEventListener('DOMContentLoaded', function() {
   console.log('result.js *******....');
   chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
      console.log('result.js message received...*******....');
      $.getJSON("guido_rossum.json", function(data) {
        console.log('JQ data: ' + data);
        $.each(data['results'], function(i, row) {
          //$("#warmly_results").append();
          console.log('row: ' + i + ': ' + row['published date']);
          render_row(row);
        });
      });
   });
}, false);

