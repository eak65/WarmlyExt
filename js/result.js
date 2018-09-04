
function render_row(row_data) {

  var row = $("<tr/>");
  $("#warmly_results").append(row);

  var td_text = '';

  if (row_data.hasOwnProperty('relevance')) {
    td_text += '<p><span class="r_hdr">Relevance:</span> ' + ss(row_data.relevance)
  }

  td_text += '<p><span class="r_hdr">Summary:</span> ' + ss(row_data.summary)
    + '<p><span class="r_hdr">Keywords:</span> ' + list_to_html_list(row_data.keywords) + "</p>";
    if (row_data.hasOwnProperty('mentions')) {
        td_text += ('<p><span class="r_hdr">Mentions:</span> ' + list_to_html_list(row_data.mentions) + "</p>");
    }
    if (row_data.hasOwnProperty('quotes')) {
        td_text += ('<p><span class="r_hdr">Quotes:</span> ' + list_to_html_list(row_data.quotes) + "</p>");
    }
    if (row_data.hasOwnProperty('snippet')) {
        td_text += ('<p><span class="r_hdr">Snippet:</span> ' + ss(row_data.snippet) + "</p>");
    }
    td_text += ('<p><span class="r_hdr">Source:</span> ' + ss(row_data.url) + "</p>"
            + '<span class="r_hdr">Published date:</span> ' + ss(row_data['published date']));
    td_text += '<canvas class="canvas"></canvas>';
  row.append($("<td>" + td_text + "</td>"));
}

function list_to_html_list(slist) {
  if (slist == null || slist.length < 1)
    return '';
  var hlist = '<ol><li>';
  hlist += slist.join('</li><li>')
  hlist += '</li></ol>';
  return hlist;
}

// safe string...
function ss(str) {
  return (str != null ? str : "n/a");
}

function render_chart(i, dataSets) {
  var ctx = document.getElementsByTagName('canvas')[i].getContext('2d');
  // This represents one color on the graph

  var chart = new Chart(ctx, {
      type: 'radar',
      data: {
          labels: ['Running', 'Swimming', 'Eating', 'Juggling'],
          datasets: dataSets
      }
  });
}
function render_result(warmly_doc) {
    $.each(warmly_doc['results'], function(i, row) {
         console.log('row: ' + i + ': ' + row['published date']);
        render_row(row);

        var dataSet = {
            label: "Ethan",
            data: [2, 10, 4, 20],
            backgroundColor: ['rgba(100, 255, 0, 0.5)']
        };
        render_chart(i, [dataSet]);
    });
}

function load_test_data() {
    $.getJSON("guido_rossum.json", function(data) {
        //data.terms = 'One two three';
        console.log('Test data: ' + data);
        render_result(data);
        $('#loading_progress').css('display', 'none');
        $('#warmly_result_title').text('Results:');
        $('#warmly_result_count').text(data.results.length);
        $('#warmly_terms').text('One Two Three');
        $('#terms').css('visibility', 'visible');
        $('#sunpalms_img').css('display', 'inline-block');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('====> result.js AddEventListener');
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        console.log('====> result.js message received: ' + request.type);
        if (request.type === 'warmly_display_result') {
            console.log('====> result.js render data: ' + request.data);
            //load_test_data();
            $('#loading_progress').css('display', 'none');
            if (request.data == null) {
                $('#warmly_result_title').text('No data found.');
            } else {
                render_result(request.data);
                $('#warmly_result_title').text('Results:');
                $('#warmly_result_count').text(request.data.results.length);

                var terms = request.data.search_criteria.target;
                $('#warmly_terms').text(terms);

                var tags = request.data.search_criteria.tags ? request.data.search_criteria.tags : "None";
                $('#warmly_tags').text(tags);

                $('#tags').show();
                $('#terms').show();

                // $('#terms').css('visibility', 'visible');
                $('#sunpalms_img').css('display', 'inline-block');
            }
        }
    });
}, false);
