var SipTransaction      = require('./sip_transaction.js');
var SipHelper           = require('./sip_helper.js');
var SipMessageTemplates = require('./sip_message_templates.js');

SipRegister.prototype.execute = function () {

  var self = this;

  this.create_listener('401', function (data) {
    console.log(data);
    self.nonce = data['WWW-Authenticate']['nonce'];
    self.realm = data['WWW-Authenticate']['realm'];
    self.sip_socket.write( self.message() );
  });

  this.create_listener('200', function (data) {
    console.log(data);
    self.kill_all_listeners();
    self.emit('success');
  });

  this.create_listener('403', function (data) { 
    console.log(data);
  });

  this.sip_socket.write( this.message() );

}
  
SipRegister.prototype.message = function () {
  return SipHelper.replace_values(  SipMessageTemplates.register, {
    'source_address':               this.sip_socket.get_source_address(),
    'source_port':                  this.sip_socket.get_source_port(),
    'destination_address':          this.sip_socket.get_sip_server_address(),
    'destination_port':             this.sip_socket.get_sip_server_port(),
    'sip_user_name':                this.sip_client.get_username(),
    'sip_nonce':                    this.get_nonce(),
    'sip_response':                 this.get_response(),
    'sip_callid':                   this.callid
  });
}

function SipRegister (sip_client,sip_socket) { this.initialize(sip_client,sip_socket); }
SipRegister.prototype.__proto__ = SipTransaction.prototype;
module.exports = SipRegister;
