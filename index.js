var SipSocket           = require('sip_socket');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipClientHelper     = require('./sip_helper.js');
var SipPing             = require('./sip_ping.js');
var SipRegister         = require('./sip_register.js');
var SipCall             = require('./sip_call.js');
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
  var transaction = new SipCall(this,this.sip_socket,phone_number);
  transaction.execute();
}

SipClient.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipClient;
