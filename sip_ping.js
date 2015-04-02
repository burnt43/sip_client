var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');


SipPing.prototype.execute = function () {
  var self = this;

  var options_message = SipHelper.replace_values( SipMessageTemplates.options, {
    'source_address':       this.sip_socket.get_source_address(),
    'source_port':          this.sip_socket.get_source_port(),
    'destination_address':  this.sip_socket.get_sip_server_address(),
    'destination_port':     this.sip_socket.get_sip_server_port(),
    'sip_callid':           this.callid
  });

  this.create_listener('200', function (data) {
    console.log(data);
    self.kill_all_listeners();
  });

  this.sip_socket.write(options_message);
}

function SipPing (sip_client,sip_socket) { this.initialize(sip_client,sip_socket); }
SipPing.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipPing;
