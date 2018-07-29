var gmail;
var warmly_base_url='https://warmly2.azurewebsites.net/api/1.0/articles';
//var warmly_base_url='http://localhost:8000/guido_rossum.json';

var result_display = `
  <button class="warmly_btn">Warmly</button>
  <dialog id='warmly_result'>
    <h1>Booya</h1>
    <ul id='results'/>
  </dialog>
`;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

function call_warmly(search_term) {
  result = "";
  $.support.cors = true;
  $.ajax({
      'url' : warmly_base_url,
      'type': 'GET',
      'dataType' : 'json',
      'data': {
          'term': search_term
      },
      'success' : function(data) {
          console.log('****>> ' + data['results']); 
          result = data;
          $.each(data.results, function(index, value) {
            $("#results").append('<li>' + value.summary + '</li>');
          });         
      },
      'error' : function(jqXHR, status, message) {
          console.log('xxxx>> ' + status + ': ' + message); 
          result = '{"results":[{}]}';
      }         
  });
  var d = document.getElementById('warmly_result');
  d.show();
  return result;
}

var main = function() {

  gmail = new Gmail();

  gmail.tools.add_toolbar_button(result_display, function() {
    gmail.tools.add_modal_window('Warmly search terms:', '<input id="warmly_criteria" type="text"/>',
      function() {
        var warmly_input = document.getElementById("warmly_criteria");
        console.log('***** ' + warmly_input);
        console.log('***** ' + warmly_input.value);
        //console.log('***** ' + call_warmly(warmly_input.value));
        chrome.runtime.sendMessage('fngjkjdgahdldbecaoakonmoboaodgkg', {type:'display_warmly_result'});
        console.log('***** sent message');
        gmail.tools.remove_modal_window();
      });
  }, 'L3');
}

refresh(main);
