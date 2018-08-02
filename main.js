var gmail;
var warmly_base_url='https://warmly2.azurewebsites.net/api/1.0/articles';
//var warmly_base_url='http://localhost:8000/guido_rossum.json';

var result_display = `
  <button class="warmly_btn">Warmly</button>
`;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

function call_warmly(search_term) {
  $.support.cors = true;
  $.ajax({
      'url' : warmly_base_url,
      'type': 'GET',
      'dataType' : 'json',
      'data': {
          'term': search_term
      },
      'success' : function(data) {
          console.log('====>> results: ' + data['results']); 
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
          result = '{"results":[{}]}';
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
          if (compdiv.outerText.indexOf('Warmly') == -1) {
              gmail.tools.add_compose_button(compose, 'Warmly', function() {
                  console.log('====> pressed warmly button...');
                  gmail.tools.add_modal_window('Warmly search terms:', 
                      '<input id="warmly_criteria" type="text"/>', warmly_action);
              }, 'warmly_btn');
          }
      }
  });
  
  var warmly_action = function() {
      var warmly_input = document.getElementById("warmly_criteria");
      console.log('====> Search term: ' + warmly_input.value);
      chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_create_popup'});
      console.log('====> sent message to request popup');
      /*setTimeout(function() {
          chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_display_result'});
      }, 1000);*/
      call_warmly(warmly_input.value);
      console.log('====> called warmly.');
      gmail.tools.remove_modal_window();
  };

  /*gmail.tools.add_toolbar_button(result_display, function() {
    gmail.tools.add_modal_window('Warmly search terms:', '<input id="warmly_criteria" type="text"/>',
      function() {
        var warmly_input = document.getElementById("warmly_criteria");
        console.log('====> Search term: ' + warmly_input.value);
        //console.log('====> ' + call_warmly(warmly_input.value));
        chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_create_popup'});
        console.log('====> sent message to request popup');
        /xsetTimeout(function() {
            chrome.runtime.sendMessage('papmjbnpmffiahcnakjfjoobkefaemii', {type:'warmly_display_result'});
        }, 1000);x/
        call_warmly(warmly_input.value);
        console.log('====> called warmly.');
        gmail.tools.remove_modal_window();
      });
  }, 'L3'); */
}

refresh(main);
