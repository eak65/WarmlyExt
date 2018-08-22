var gmail;
var warmly_base_url='https://warmly2.azurewebsites.net/api/1.0/articles';
//var warmly_base_url='http://localhost:8000/guido_rossum.json';

var result_display = `
    <table class="search">
      <tr><td></td><td>This will be the person you are trying to connect with.</td></tr>
      <tr><td><label for="target">Target:</label></td>
          <td><input class="search-input" type="text" id="target"></td></tr>
      <tr><td></td><td>These are key terms that we'll use to create mutual interest.</td></tr>
      <tr><td><label for="input-tags">Connectors:</label></td>
          <td><input type="text" id="connector-tags" class="demo-default"
                    placeholder="Enter words then tab or return after each."></td></tr>
      <tr><td></td><td>This is your statement for next steps. Use at least one of the connectors in your closing.</td></tr>
      <tr><td><label for="closing">Closing:</label></td>
          <td><textarea class="search-input" id="closing" cols="45" rows="4"></textarea></td></tr>
    </table>
`;

var warmly_btn_label = "Warm";

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

function call_warmly(search_criteria) {
  $.support.cors = true;
  $.ajax({
      'url' : warmly_base_url,
      'type': 'GET',
      'dataType' : 'json',
      'data': {
          'target': search_criteria.target,
          'connectors': search_criteria.tags,
          'closing': search_criteria.closing
      },
      'success' : function(data) {
          console.log('====>> results: ' + data['results']); 
          data.search_criteria = search_criteria;
          if (data['results'].length > 0) {
              for (var i = 0; i < data['results'].length; i++) {
                  console.log('====> published date type: ' + typeof(data['results'][i]['published date']));
              }
          }
          var payload = {type: 'warmly_display_result', data: data};
          console.log('====>> payload type: ' + payload.type + ' payload data: ' + payload.data);
          chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', payload);
      },
      'error' : function(jqXHR, status, message) {
          console.log('====> service call error: ' + status + ': ' + message); 
          data = {"results":[]};
          data.search_criteria = new Object(); 
          data.search_criteria.target = 'Unable to analyze target due to various issues. Often times it works if you try again.';
          data.search_criteria.tags = '';
          data.search_criteria.closing = '';
          chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', 
             {type: 'warmly_display_result', data: data});
      }         
  });
}

var main = function() {

  $("<style>")
    .prop("type", "text/css")
    .html("\
    .warmly_btn {\
      background-color: #ff6666; \
      background-image: none; \
    }").appendTo("head");

  gmail = new Gmail();

  gmail.observe.on('compose', function() {
      console.log('====> compose');

      // we need to deal with multiple open compose popups...
      var comps = gmail.dom.composes();
      for (var i = 0; i < comps.length; i++) {
          var compose = comps[i];
          var compdiv = compose['$el'][0];
          //console.log('====> ' + compdiv.outerText);
          if (compdiv.outerText.indexOf(warmly_btn_label) == -1) {
              gmail.tools.add_compose_button(compose, warmly_btn_label, function() {
                  console.log('====> pressed warmly button...');
                  gmail.tools.add_modal_window('', 
                      result_display, warmly_action);
              }, 'warmly_btn');
              var dialog_div = document.getElementById('gmailJsModalWindowContent');
              console.log('====> dialog type: ' + typeof dialog_div);
          }
      }
  });
  
  var warmly_action = function() {
      var args = new Object(); 
      args.target = document.getElementById("target").value;
      args.tags = document.getElementById("connector-tags").value;
      args.closing = document.getElementById("closing").value;
      console.log('====> target: ' + args.target
          + ' tags: ' + args.tags + ' closing: ' + args.closing);
      chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_create_popup'});
      console.log('====> sent message to request popup');
      /*setTimeout(function() {
          chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_display_result'});
      }, 1000);*/
      call_warmly(args);
      console.log('====> called warmly.');
      gmail.tools.remove_modal_window();
  };
}

refresh(main);
