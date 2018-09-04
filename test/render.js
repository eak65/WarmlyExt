function render_row(row_data) {

  var row = $("<tr/>");
  $("#warmly_results").append(row);

  var td_text = '<p><span class="r_hdr">Summary: </span>' + ss(row_data.summary)
    + '<p><span class="r_hdr">Keywords: </span>' + ss(row_data.keywords).join(",") + "</p>";
    if (row_data.hasOwnProperty('Quotes')) {
        td_text += ('<p><span class="r_hdr">Quotes: </span>' + ss(row_data.Quotes) + "</p>");
    }
    if (row_data.hasOwnProperty('Snippet')) {
        td_text += ('<p><span class="r_hdr">Snippet: </span>' + ss(row_data.Snippet) + "</p>");
    }
    td_text += ('<p><span class="r_hdr">Source: </span>' + ss(row_data.url) + "</p>"
            + '<span class="r_hdr">Published date: </span>' + ss(row_data['published date']));

  row.append($("<td>" + td_text + "</td>"));
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
    console.log('Test data: ' + data);
    data.terms = 'One two three';
    render_result(data); 
    document.getElementById('loading_progress').style.display = 'none';
    document.getElementById('warmly_result_title').innerHTML = 'Results:';
    document.getElementById('warmly_result_count').innerHTML = data.results.length;
    document.getElementById('warmly_terms').innerHTML = 'One Two Three';
    document.getElementById('terms').style.visibility = 'visible';
    document.getElementById('sunpalms_img').style.display = 'inline-block';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('====> result.js AddEventListener');
    load_test_data();
}, false);

