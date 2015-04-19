var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipMessage          = require('./sip_message.js');

SipRegister.prototype.execute = function () {

  var self = this;
  var initial_request     = new SipMessage( SipMessageTemplates.register, this.message_data() );
  var challenge_response  = null;

  this.create_listener('401', function (data) {
    self.nonce          = data['WWW-Authenticate']['nonce'];
    self.realm          = data['WWW-Authenticate']['realm'];
    challenge_response  = new SipMessage( SipMessageTemplates.register, self.message_data() );

    self.sip_socket.write( challenge_response.to_s() );
  });

  this.create_listener('200', function (data) {
    self.kill_all_listeners();
    self.emit('success');
  });

  this.sip_socket.write( initial_request.to_s() );

}
  
SipRegister.prototype.message_data = function () {
  return {
    'source_address':               this.sip_socket.get_source_address(),
    'source_port':                  this.sip_socket.get_source_port(),
    'destination_address':          this.sip_socket.get_sip_server_address(),
    'destination_port':             this.sip_socket.get_sip_server_port(),
    'sip_user_name':                this.sip_client.get_username(),
    'sip_nonce':                    this.get_nonce(),
    'sip_response':                 this.get_response(),
    'sip_callid':                   this.callid
  }
}

SipRegister.prototype.log_color     = function () { return 'BLUE' }
SipRegister.prototype.message_name  = function () { return 'REGISTER'; }

function SipRegister (sip_client,sip_socket) { this.initialize(sip_client,sip_socket); }
SipRegister.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipRegister;
