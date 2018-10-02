
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

var synonymsUI;

// tweaks the response from warmly service
// param: response
// returns: response (tweaked)
function patch_warmly_data(w2_in) {
    if ( ! ('radar' in w2_in)) {
        return testdata;
    }
    // fix wrong key name for 'labels'
    if ('label' in w2_in['radar']) {
        var label_data = w2_in['radar']['label']
        w2_in['radar']['labels'] = label_data;
    }
    // colorize the first radar dataset
    if (w2_in['radar']['datasets'].length > 0) {
        w2_in['radar']['datasets'][0].backgroundColor = ['rgba(255, 100, 0, 0.5)'];
    }
    return w2_in;
}

function render_top_section(warmly_data) {
    var patched = patch_warmly_data(warmly_data);
    synonymsUI = render_synonyms(transform_synonym_to_nodes_and_edges(patched));
    synonymsUI.on("click", function (params) {
        console.log(params);
    });

    $('#target_out').text(patched['target']);

    render_clickable_words($('#identifiers_out'), patched['identifiers'], function (e) {
        console.log('====> identifier: ' + e);
    });

    render_clickable_words($('#connectors_out'), patched['connectors'], function (e) {
        console.log('====> connector: ' + e);
    });

    $('#snippet_text').text(patched['snippet']);
    render_radar_chart(patched);
}

function render_clickable_words(container, words, onclick) {
    $.each(words, function(i, word) {
        var anchor = $('<a href="#"></a>');
        anchor.text(word);
        anchor.on("click", function() {
            onclick($(this).text());
        });

        container.append(anchor);
        if (i < words.length-1) {
            container.append(', ');
        }
    });
}
// populates nodes & edges data from warmly web response.
// Nodes & edges format used by vis.js to populate
// network diagram display for synonyms
//
// param: web response
// returns: object with array of nodes and array of edges
function transform_synonym_to_nodes_and_edges(data) {
    // return value
    var result = new Object();
    var nodes = [];
    var edges = [];

    // unique node id
    var idgen=0;

    $.each(data['synonym'], function(i, sobj) {
        var start=idgen;
        //console.log('root: ' + idgen + ': ' + sobj['root']);
        nodes.push({id: idgen, label: sobj['root']})
        idgen++;
        $.each(sobj['syn'], function(i, sdata) {
            //console.log('syn: ' + idgen + ': ' + sdata);
            nodes.push({id: idgen, label: sdata})
            idgen++;
        });
        for (k=start; k<idgen-1; k++) {
            //console.log('edge: ' + start + ' => ' + (k+1));
            edges.push({ from: start, to: k+1});
        }
    });
    result.nodes = nodes;
    result.edges = edges;

    return result;
}

// vis.js rendering...
function render_synonyms(data) {

    var container = document.getElementById('synonyms');
    var visdata = {
      nodes: data.nodes,
      edges: data.edges
    };
    var options = {
      nodes: {
        shape: 'box',
        margin: 10,
        widthConstraint: {
          maximum: 200
        }
      },
      layout: {
          hierarchical: {
              direction: "UD",
              sortMethod: "directed",
              levelSeparation: 75,
              nodeSpacing: 40,
              treeSpacing: 20 // treeSpacing doesn't seem to work
          }
      }
    };

    return new vis.Network(container, visdata, options);
}

function render_radar_chart(data) {
  var ctx = $('#radar');

  var chart = new Chart(ctx, {
      type: 'radar',
      data: data['radar'],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: 'right',
          boxWidth: 10
        }
      }
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
                if ('results' in request.data) {
                    $('#warmly_result_count').text(request.data.results.length);
                } else if ('mips' in request.data) {
                   $('#warmly_result_count').text(request.data.mips.length);
                } else {
                    console.log('====> result.js falling back to test data...');
                    request.data = testdata;
                }

                render_top_section(request.data);

                var accordionTab = createAccordion(request.data["mips"]);
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
