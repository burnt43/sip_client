var SipSocket           = require('sip_socket');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipClientHelper     = require('./sip_helper.js');
var SipPing             = require('./sip_ping.js');
var SipRegister         = require('./sip_register.js');
var SipTransaction      = require('./sip_transaction.js');


function SipClient (sip_server_address,sip_server_port,username,password) {

  this.sip_server_address = sip_server_address;
  this.sip_server_port    = sip_server_port;
  this.username           = username;
  this.password           = password;
  this.sip_socket         = new SipSocket(this.sip_server_address,this.sip_server_port);

}

SipClient.prototype.get_username = function () { return this.username }
SipClient.prototype.get_password = function () { return this.password }

SipClient.prototype.connect = function () {

  this.sip_socket.connect();
  var self = this;
  this.sip_socket.on('connection_established', function () {
    self.emit('connection_established');
  });
    
}

SipClient.prototype.ping_server = function () {
  var self = this;
  var transaction = new SipPing(this,this.sip_socket);
  transaction.execute();
  transaction.once('success', function () {
    self.emit('success');
  });
}

SipClient.prototype.register = function () {
  var self = this;
  var transaction = new SipRegister(this,this.sip_socket);
  transaction.execute();
  transaction.once('success', function () {
    self.emit('success');
  });
}

SipClient.prototype.place_call = function ( phone_number ) {
/*  
  var self = this;
  var callid = this.create_callid();

  function create_invite_message (nonce, response) {
    if ( !nonce ) { nonce = self.generate_nonce(); }
    if ( !response ) { response = self.generate_response(); }

    return SipClientHelper.replace_values( SipMessageTemplates.invite, {
      'source_address'      : self.sip_socket.get_source_address(),
      'source_port'         : self.sip_socket.get_source_port(),
      'destination_address' : self.sip_socket.get_sip_server_address(),
      'destination_port'    : self.sip_socket.get_sip_server_port(),
      'sip_callid'          : callid,
      'sip_user_name'       : self.username,
      'sip_nonce'           : nonce,
      'sip_response'        : response,
      'dialed_number'       : phone_number
    });
  }

  this.sip_socket.on('401', function (data) {
    console.log(data);
    var nonce = data['WWW-Authenticate']['nonce'];
    var realm = data['WWW-Authenticate']['realm'];
    //need to rework generate_response to work for more than just registers
    var response = SipClientHelper.md5_sum( SipClientHelper.md5_sum(self.username + ':' + realm + ':' + self.password) + ':' + nonce + ':' + SipClientHelper.md5_sum('INVITE:sip:'+phone_number+'@'+self.sip_socket.get_sip_server_address()) );
    self.sip_socket.write ( create_invite_message( nonce, response ) );
  });

  this.sip_socket.write( create_invite_message() );
*/
}

SipClient.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipClient;
