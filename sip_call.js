var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');

SipCall.prototype.execute = function () {

  var self = this;

  this.create_listener('401', function (data) {
    console.log('\033[0;36m');
    console.log(data);
    console.log('\033[0;39m');
    self.nonce = data['WWW-Authenticate']['nonce'];
    self.realm = data['WWW-Authenticate']['realm'];
    //self.sip_socket.write( self.message() );
  });

  this.sip_socket.write( this.request() );

}
  
SipCall.prototype.request = function () {
  return SipHelper.replace_values( SipMessageTemplates.invite, {
    'source_address'      : this.sip_socket.get_source_address(),
    'source_port'         : this.sip_socket.get_source_port(),
    'destination_address' : this.sip_socket.get_sip_server_address(),
    'destination_port'    : this.sip_socket.get_sip_server_port(),
    'sip_callid'          : this.callid,
    'sip_user_name'       : this.sip_client.get_username(),
    'sip_nonce'           : this.get_nonce(),
    'sip_response'        : this.get_response(),
    'dialed_number'       : this.phone_number
  });
}

SipCall.prototype.challenge_response = function () {
  return '';
}

SipCall.prototype.message_name = function () { return 'INVITE'; }

function SipCall (sip_client,sip_socket,phone_number) { 
  this.initialize(sip_client,sip_socket);
  this.phone_number = phone_number;
}

SipCall.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipCall;
