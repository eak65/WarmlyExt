var gmail;

var warmly_base_url='https://warmly2.azurewebsites.net/api/1.0/articles';
//var warmly_base_url='http://localhost:8000/guido_rossum.json';


// TODO: should be loadable HTML file/template...
var criteria_dialog = `
    <table class="search">
      <tr><td></td><td>This will be the person you are trying to connect with.</td></tr>
      <tr><td><label for="target">Name:</label></td>
          <td><input class="search-input" type="text" id="target"></td></tr>
      <tr><td></td><td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, Identifiers.</td></tr>
      <tr><td><label for="identifier-tags">Identifiers:</label></td>
          <td><input type="text" id="identifier-tags" class="demo-default"
                    placeholder="Enter words then tab or return after each."></td></tr>
      <tr><td></td><td>These are key terms that we'll use to create mutual interest.</td></tr>
      <tr><td><label for="connector-tags">Connectors:</label></td>
          <td><input type="text" id="connector-tags" class="demo-default"
                    placeholder="Enter words then tab or return after each."></td></tr>
      <tr><td></td><td>This is your statement for next steps. Use at least one of the connectors in your closing.</td></tr>
      <tr><td><label for="closing">Closing:</label></td>
          <td><textarea class="search-input" id="closing" cols="45" rows="4"></textarea></td></tr>
    </table>
`;

// TODO: externalize
var warmly_btn_label = "Warm";

function refresh(warmly_entry_point) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + warmly_entry_point + ')', 10);
  } else {
    console.log('===> document.readyState: ' + document.readyState);
    warmly_entry_point();
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
          'identifiers': search_criteria.identifiers,
          'connectors': search_criteria.connectors,
          'closing': search_criteria.closing
      },
      'success' : function(data) {
          console.log('====>> results: ' + data['results']);
          data.search_criteria = search_criteria;
          /*if (data['results'].length > 0) {
              for (var i = 0; i < data['results'].length; i++) {
                  console.log('====> published date type: ' + typeof(data['results'][i]['published date']));
              }
          }*/
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

// RegEx to parse recipient email in form of 'First Last <someemail@domain.foo.co.uk>'
// We just want the name portion....
// If these two declarations are moved to the top of this file
// it breaks.
var email_re=/([\w\s,\._-]*)<([-.\w]+@[\w-]+(\.+[\w-]+)*)>/
var recipient_name=null;

function isRegisteredEmail(email) {
  // Add our registered email list here
  var emails = ["ghutirea@gmail.com"];
  return emails.includes(email);
}

function get_connector_words() {
    var connectors = $('#connector-tags').val().split(',');
    console.log('====> connectors: ' + connectors);
    return connectors;
}

var main = function() {
  gmail = new Gmail();

  init_highlight_within_textarea($);

  $("<style>")
    .prop("type", "text/css")
    .html("\
    .warmly_btn {\
      background-color: #ff6666; \
      background-image: none; \
    }").appendTo("head");

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


                  if (!isRegisteredEmail(gmail.get.user_email())) {
                    var openRegistrationPage = function() {
                      window.open('https://brianlee11.typeform.com/to/aZzb92').focus();
                    };
                    gmail.tools.add_modal_window('Warmly Registration', 'Would you like register for Warmly?', openRegistrationPage);
                  }
                  else {
                    gmail.tools.add_modal_window('',
                    criteria_dialog, warmly_action);

                    if (recipient_name!=null) {
                      $('#target').val(recipient_name);
                    }
                  }
              }, 'warmly_btn');

              var dialog_div = $('#gmailJsModalWindowContent');
              console.log('====> dialog type: ' + typeof dialog_div);
          }
      }
  });

  gmail.observe.on('recipient_change', function(match, recipients) {
      var z = 0;

      if (recipients==null || ! ('to' in recipients)
       || recipients.to.length<1 || recipients.to[0].trim().length<1) {
          recipient_name = null;
          console.log('recipients cleared');
          return;
      }
      console.log('recipients changed to:', recipients.to[0]);
      var parsed = recipients.to[0].match(email_re);
      console.log('recipients parts:', parsed);
      var recipient = parsed!=null?(parsed.length>2?parsed[1]:null):null;
      if (recipient!=null) {
          recipient_name = recipient.trim();
      }

      console.log('Name part: ' + recipient_name);
  });

  var warmly_action = function() {
      var args = new Object();
      args.target = $('#target').val();
      args.connectors = $('#connector-tags').val();
      args.identifiers = $('#identifier-tags').val();
      args.closing = $('#closing').val();
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
