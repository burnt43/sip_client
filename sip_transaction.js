var SipHelper = require('./sip_helper.js');

SipTransaction.prototype.initialize = function (sip_client,sip_socket) {
  this.sip_client = sip_client;
  this.sip_socket = sip_socket;
  this.callid     = this.create_callid();
  this.listeners  = {};
}

SipTransaction.prototype.create_callid = function () {
  return SipHelper.md5_sum( SipHelper.random_number() ) + '@' + this.sip_socket.get_source_address();
}

SipTransaction.prototype.create_listener = function (message_type,callback) {
  this.listeners[message_type] = callback
  this.sip_socket.on(message_type,callback);
}

SipTransaction.prototype.kill_all_listeners = function () {
  var self = this;
  Object.keys(this.listeners).forEach( function (message_type) {
    self.sip_socket.removeListener(message_type,self.listeners[message_type]);
  });
}

SipTransaction.prototype.execute = function () { throw 'execute() must be defined in subclass!' }

function SipTransaction (sip_client,sip_socket) { initialize(sip_client,sip_socket); }
module.exports = SipTransaction;
