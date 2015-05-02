var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipMessage          = require('./sip_message.js');

SipCall.prototype.execute = function () {

  var self                = this;
  var initial_request     = new SipMessage( SipMessageTemplates.invite, this.message_data(), 101 );
  var challenge_response  = null;
  var ack                 = null;
  var content             = 'v=0\n'
    + 'o=root 268027673 268027674 IN IP4 127.0.0.1\n'
    + 'c=IN IP4 127.0.0.1\n'
    + 't=0 0\n'
    + 'm=audio 15374 RTP/AVP 0\n'
    + 'a=rtpmap:0 PCMU/8000\n'
    + 'a=ptime:20\n'
    + 'a=sendrecv\n';

  initial_request.set_content(content)

  this.create_listener('401', function (data) {
    self.nonce          = data['WWW-Authenticate']['nonce'];
    self.realm          = data['WWW-Authenticate']['realm'];
    ack                 = new SipMessage( SipMessageTemplates.ack   , self.message_data() );
    challenge_response  = new SipMessage( SipMessageTemplates.invite, self.message_data(), 102 );

    challenge_response.set_content(content);
    self.sip_socket.write( ack.to_s() );
    self.sip_socket.write( challenge_response.to_s() );
  });

  this.create_listener('200', function(data) {
    var ack_with_auth = new SipMessage( SipMessageTemplates.ack_with_auth, self.message_data(), 102 );
    setTimeout( function () {
      self.sip_socket.write( ack_with_auth.to_s() );
    }, 1000 );
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

SipCall.prototype.log_color           = function () { return 'GREEN'; }
SipCall.prototype.authorization_line  = function () { 
  return 'INVITE:sip:' + this.phone_number + '@' + this.sip_socket.get_sip_server_address();
}

function SipCall (sip_client,sip_socket,phone_number) { 
  this.initialize(sip_client,sip_socket);
  this.phone_number = phone_number;
}

SipCall.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipCall;
