
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

  row.append($("<td>" + td_text + "</td>"));
}

function list_to_html_list(slist) {
  if (slist == null || slist.length < 1)
    return '';
  var hlist = '<ol class="keywords-list"><li>';
  hlist += slist.join('</li><li>')
  hlist += '</li></ol>';
  return hlist;
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
            $('#results-data').css('display', 'table');
            if (request.data == null) {
                $('#warmly_result_title').text('No data found.');
            } else {
                // render_result(request.data);
                // $('#warmly_result_title').text('Results:');
                $('#warmly_result_count').text(request.data.results.length);

                var terms = request.data.search_criteria.target;
                $('#warmly_terms').text(terms);

                var tags = request.data.search_criteria.tags ? request.data.search_criteria.tags : "None";
                $('#warmly_tags').text(tags);
                //
                // $('#tags').show();
                // $('#terms').show();

                // $('#terms').css('visibility', 'visible');
                // $('#sunpalms_img').css('display', 'inline-block');
                var sampleJson = JSON.parse(`{
                  "connectors": [
                    "student",
                    "success",
                    "graduation"
                  ],
                  "identifiers": [
                    "UMBC",
                    "education technology"
                  ],
                  "mips": [
                    {
                      "c": {
                        "keywords": [
                          "k1",
                          "k2"
                        ],
                        "mentions": [
                          "mention string 1",
                          "mention string 2"
                        ],
                        "published date": "date",
                        "quotes": [
                          "quote string 1",
                          "quote string 2"
                        ],
                        "relevance": 0.92,
                        "snippet": "string",
                        "summary": "summary",
                        "url": "url string"
                      },
                      "m": "string"
                    },
                    {
                      "c": {
                        "keywords": [
                          "k1",
                          "k2"
                        ],
                        "mentions": [
                          "mention string 1",
                          "mention string 2"
                        ],
                        "published date": "date",
                        "quotes": [
                          "quote string 1",
                          "quote string 2"
                        ],
                        "relevance": 0.92,
                        "snippet": "string",
                        "summary": "summary",
                        "url": "url string"
                      },
                      "m": "string"
                    }
                  ],
                  "radar": {
                    "datasets": [
                      {
                        "data": [
                          51,
                          25,
                          39
                        ]
                      }
                    ],
                    "label": [
                      "s1",
                      "s2",
                      "s3"
                    ]
                  },
                  "snippet": "test message",
                  "synonym": [
                    {
                      "root": "success",
                      "syn": [
                        "achievement",
                        "accomplishment",
                        "winning"
                      ]
                    },
                    {
                      "root": "graduation",
                      "syn": [
                        "commencement",
                        "convocation"
                      ]
                    }
                  ],
                  "target": "John Fritz"
                }`);

                var accordionTab = createAccordion(sampleJson["mips"]);
                document.querySelector('#results-accordion').insertAdjacentHTML('beforeend', accordionTab);

                $('.mdlext-accordion__tab').click(function() {
                  $(this).next('.mdlext-accordion__tabpanel').toggle();

                  var ariaExpandedValue = $(this).attr('aria-expanded');
                  $(this).attr('aria-expanded', !(ariaExpandedValue === 'true'));
                });
            }
        }
    });
}, false);
