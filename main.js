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
          var payload = {type: 'warmly_display_result', data: data};
          console.log('====>> payload type: ' + payload.type + ' payload data: ' + payload.data);
          chrome.runtime.sendMessage('elfgdpepfbaecnmmjaimeljhmlobefkc', payload);
      },
      'error' : function(jqXHR, status, message) {
          console.log('====> service call error: ' + status + ': ' + message); 
          result = '{"results":[{}]}';
          chrome.runtime.sendMessage('elfgdpepfbaecnmmjaimeljhmlobefkc', 
             {type: 'warmly_display_result', data: data});
      }         
  });
}

var main = function() {

  gmail = new Gmail();

  gmail.tools.add_toolbar_button(result_display, function() {
    gmail.tools.add_modal_window('Warmly search terms:', '<input id="warmly_criteria" type="text"/>',
      function() {
        var warmly_input = document.getElementById("warmly_criteria");
        console.log('====> Search term: ' + warmly_input.value);
        //console.log('====> ' + call_warmly(warmly_input.value));
        chrome.runtime.sendMessage('elfgdpepfbaecnmmjaimeljhmlobefkc', {type:'warmly_create_popup'});
        console.log('====> sent message to request popup');
        /*setTimeout(function() {
            chrome.runtime.sendMessage('elfgdpepfbaecnmmjaimeljhmlobefkc', {type:'warmly_display_result'});
        }, 1000);*/
        call_warmly(warmly_input.value);
        console.log('====> called warmly.');
        gmail.tools.remove_modal_window();
      });
  }, 'L3');
}

refresh(main);
