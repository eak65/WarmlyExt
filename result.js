function render_row(row_data) {
  var row = $("<tr/>");
  $("#warmly_results").append(row);
  row.append($("<td>"
    + ss(row_data.summary)
    + '<p><span class="r_hdr">Keywords: </span>' + ss(row_data.keywords).join(",") + "</p>"
    + '<p><span class="r_hdr">Source: </span>' + ss(row_data.url) + "</p>"
    + '<span class="r_hdr">Published date: </span>' + ss(row_data['published date'])
    + "</td>"));
}

// safe string...
function ss(str) {
  return (str != null ? str : "n/a");
}

function render_result(warmly_doc) {
    $.each(warmly_doc['results'], function(i, row) {
         console.log('row: ' + i + ': ' + row['published date']);
        render_row(row);
    });
}

function load_test_data() {
    $.getJSON("guido_rossum.json", function(data) {
        console.log('Test data: ' + data);
        render_result(data); 
        document.getElementById('loading_img').style.display = 'none';
        document.getElementById('warmly_result_title').innerHTML = 'Results:';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('====> result.js AddEventListener');
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        console.log('====> result.js message received: ' + request.type);
        if (request.type === 'warmly_display_result') {
            console.log('====> result.js render data: ' + request.data);
            //load_test_data();
            document.getElementById('loading_img').style.display = 'none';
            if (request.data == null || request.data['results'].length < 1) {
                document.getElementById('warmly_result_title').innerHTML = 'No data found.';
            } else {
                document.getElementById('warmly_result_title').innerHTML 
                    = 'Results: ' + request.data['results'].length;
                render_result(request.data); 
            }
        }
    });
}, false);

