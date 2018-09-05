var nodes = [];
var edges = [];

var synonymsUI;

document.addEventListener('DOMContentLoaded', function() {
    console.log('====> synonyms.js AddEventListener');
    // in live page, get data via
    // chrome.runtime.onMessageExternal.addListener(...)
    // instead of testdata.js, as in result.js
    transform_synonym_to_nodes_and_edges(testdata);
    render_synonyms(null);
}, false);

// populates nodes & edges data from warmly web response.
// Nodes & edges format used by vis.js to populate
// network diagram display for synonyms
function transform_synonym_to_nodes_and_edges(data) {
    // unique node id
    var idgen=0;

    $.each(data['synonym'], function(i, sobj) {
        var start=idgen;
        console.log('root: ' + idgen + ': ' + sobj['root']);
        nodes.push({id: idgen, label: sobj['root']})
        idgen++;
        $.each(sobj['syn'], function(i, sdata) {
            console.log('syn: ' + idgen + ': ' + sdata);
            nodes.push({id: idgen, label: sdata})
            idgen++;
        });
        for (k=start; k<idgen-1; k++) {
            console.log('edge: ' + start + ' => ' + (k+1));
            edges.push({ from: start, to: k+1});
        }
    });
}

// vis.js rendering...
function render_synonyms(data) {

    var container = document.getElementById('synonyms');
    var visdata = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      /*edges: {
        font: {
          size: 12
        },
        widthConstraint: {
          maximum: 90
        }
      },*/
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
              treeSpacing: 100 // treeSpacing doesn't seem to work
              //blockShifting: true,
              //edgeMinimization: true,
              //parentCentralization: true
          }
      }/*,
      interaction: {dragNodes :false} */
    };
    synonymsUI = new vis.Network(container, visdata, options);
    synonymsUI.on("click", function (params) {
        console.log(params);
    });
}
