var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipMessage          = require('./sip_message.js');


SipPing.prototype.execute = function () {
  var self = this;
  var options_message = new SipMessage( SipMessageTemplates.options, this.message_data() );

  this.create_listener('200', function (data) {
    self.kill_all_listeners();
    self.emit('success');
  });

  this.sip_socket.write( options_message.to_s() );
}

SipPing.prototype.message_data = function () {
  return {
    'source_address':       this.sip_socket.get_source_address(),
    'source_port':          this.sip_socket.get_source_port(),
    'destination_address':  this.sip_socket.get_sip_server_address(),
    'destination_port':     this.sip_socket.get_sip_server_port(),
    'sip_callid':           this.callid
  };
}

SipPing.prototype.log_color = function () { return 'RED' }

function SipPing (sip_client,sip_socket) { this.initialize(sip_client,sip_socket); }
SipPing.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipPing;
