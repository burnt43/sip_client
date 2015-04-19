var SipHelper = require('./sip_helper.js');
var COLORS    = {
  'BLACK' : 30,
  'RED'   : 31,
  'GREEN' : 32,
  'YELLOW': 33,
  'BLUE'  : 34,
  'PURPLE': 35,
  'TEAL:':  36
};

//
// GETTERS
//

SipTransaction.prototype.get_nonce = function () {
  if (this.nonce) {
    return this.nonce;
  } else {
    return SipHelper.md5_sum( SipHelper.random_number() ).substring(0,8);
  }
}

SipTransaction.prototype.get_response = function () {
  return SipHelper.md5_sum( SipHelper.md5_sum(this.sip_client.get_username() + ':' + this.realm + ':' + this.sip_client.get_password())
                            + ':' 
                            + this.get_nonce()
                            + ':' 
                            + SipHelper.md5_sum( this.message_name() + ':sip:' + this.sip_socket.get_sip_server_address()) );
}


//
// LISTERNER FUNCTIONS
//

SipTransaction.prototype.create_listener = function (message_type,callback) {

  var self = this;
  var callback_with_ignore = function (data) {
    self.log_data(data);
    if ( self.accept_response(data) ) {
      callback(data);
    }
  }

  this.listeners[message_type] = callback_with_ignore;
  this.sip_socket.on(message_type,callback_with_ignore);

}

SipTransaction.prototype.kill_all_listeners = function () {
  var self = this;
  Object.keys(this.listeners).forEach( function (message_type) {
    self.sip_socket.removeListener(message_type,self.listeners[message_type]);
  });
}

//
// PRIVATE HELPER STUFF
//

SipTransaction.prototype.create_callid = function () {
  return SipHelper.md5_sum( SipHelper.random_number() ) + '@' + this.sip_socket.get_source_address();
}

SipTransaction.prototype.accept_response = function ( data ) {
  return this.callid == data['Call-ID'];
}

SipTransaction.prototype.log_data = function ( data ) {
  console.log('\033[0;' + COLORS[this.log_color()] + 'm');
  console.log(data);
  console.log('\033[0;39m');
}

//
// FUNCTIONS I EXCEPT TO BE IMPLEMENTED IN CHILDREN
//

SipTransaction.prototype.execute      = function () { throw 'execute() must be defined in subclass!' }
SipTransaction.prototype.message_name = function () { throw 'execute() must be defined in subclass!' }
SipTransaction.prototype.log_color    = function () { throw 'execute() must be defined in subclass!' }

//
// CLASS DEFINITION AND CONSTRUCTOR
//

SipTransaction.prototype.initialize = function (sip_client,sip_socket) {
  this.sip_client = sip_client;
  this.sip_socket = sip_socket;
  this.callid     = this.create_callid();
  this.listeners  = {};
}

function SipTransaction (sip_client,sip_socket) { initialize(sip_client,sip_socket); }
SipTransaction.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipTransaction;
