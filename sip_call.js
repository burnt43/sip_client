var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipMessage          = require('./sip_message.js');

SipCall.prototype.execute = function () {

  var self                = this;
  var initial_request     = new SipMessage( SipMessageTemplates.invite, this.message_data() );
  var challenge_response  = null;

  this.create_listener('401', function (data) {
    self.nonce = data['WWW-Authenticate']['nonce'];
    self.realm = data['WWW-Authenticate']['realm'];
    //self.sip_socket.write( self.message() );
  });

  this.sip_socket.write( initial_request.to_s() );

}
  
SipCall.prototype.message_data = function () {
  return {
    'source_address'      : this.sip_socket.get_source_address(),
    'source_port'         : this.sip_socket.get_source_port(),
    'destination_address' : this.sip_socket.get_sip_server_address(),
    'destination_port'    : this.sip_socket.get_sip_server_port(),
    'sip_callid'          : this.callid,
    'sip_user_name'       : this.sip_client.get_username(),
    'sip_nonce'           : this.get_nonce(),
    'sip_response'        : this.get_response(),
    'dialed_number'       : this.phone_number
  };
}

SipCall.prototype.log_color     = function () { return 'GREEN'; }
SipCall.prototype.message_name  = function () { return 'INVITE'; }

function SipCall (sip_client,sip_socket,phone_number) { 
  this.initialize(sip_client,sip_socket);
  this.phone_number = phone_number;
}

SipCall.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipCall;
