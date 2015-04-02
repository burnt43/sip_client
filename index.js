var SipSocket           = require('sip_socket');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipClientHelper     = require('./sip_helper.js');
var SipPing             = require('./sip_ping.js');
var SipTransaction      = require('./sip_transaction.js');


function SipClient (sip_server_address,sip_server_port,username,password) {

  this.sip_server_address = sip_server_address;
  this.sip_server_port    = sip_server_port;
  this.username           = username;
  this.password           = password;
  this.sip_socket         = new SipSocket(this.sip_server_address,this.sip_server_port);

}

SipClient.prototype.connect = function () {

  this.sip_socket.connect();
  var self = this;
  this.sip_socket.on('connection_established', function () {
    self.emit('connection_established');
  });
    
}

SipClient.prototype.ping_server = function () {
  var transaction = new SipPing(this,this.sip_socket);
  transaction.execute();
}

SipClient.prototype.create_callid = function () { return this.generate_response() + '@' + this.sip_socket.get_source_address(); }
SipClient.prototype.generate_nonce = function () { return this.generate_response().substring(0,8); }

SipClient.prototype.generate_response = function (nonce,realm) {
  if ( !nonce || !realm ) {
    return SipClientHelper.md5_sum( SipClientHelper.random_number() );
  } else {
    return SipClientHelper.md5_sum( SipClientHelper.md5_sum(this.username + ':' + realm + ':' + this.password) + ':' + nonce + ':' + SipClientHelper.md5_sum('REGISTER:sip:'+this.sip_socket.get_sip_server_address()) );
  }
}

SipClient.prototype.register_listeners = function (listeners) {

  var self = this;
  Object.keys(listeners).forEach( function(listener_name) {
    self.sip_socket.on(listener_name, listeners[listener_name]);
  });
}

SipClient.prototype.remove_listeners = function (listeners) {
  
  var self = this;
  Object.keys(listeners).forEach( function(listener_name) {
    self.sip_socket.removeAllListeners(listener_name);
  });

}


SipClient.prototype.register = function () {

  var self = this;
  var callid = this.create_callid();

  function unauthorized (data) {
    console.log(data);
    var nonce = data['WWW-Authenticate']['nonce'];
    var realm = data['WWW-Authenticate']['realm'];
    response = self.generate_response(nonce,realm);
    self.sip_socket.write( create_register_message(nonce,response) );
  }

  function ok (data) {
    console.log(data);
    self.remove_listeners(listeners);
    self.emit('registration_successful');
  }

  function forbidden (data) { console.log(data); }

  var listeners = {
    '200': ok,
    '401': unauthorized,
    '403': forbidden
  }

  function create_register_message (nonce, response) {
      if ( !nonce ) { nonce = self.generate_nonce(); }
      if ( !response ) { response = self.generate_response() }

      return SipClientHelper.replace_values( SipMessageTemplates.register, {
        'source_address':       self.sip_socket.get_source_address(),
        'source_port':          self.sip_socket.get_source_port(),
        'destination_address':  self.sip_socket.get_sip_server_address(),
        'destination_port':     self.sip_socket.get_sip_server_port(),
        'sip_user_name':        self.username,
        'sip_nonce':            nonce,
        'sip_response':         response,
        'sip_callid':           callid
      });
  }

  this.register_listeners(listeners);
  this.sip_socket.write( create_register_message() );

}

SipClient.prototype.place_call = function (phone_number) {
  
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

}

SipClient.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipClient;
