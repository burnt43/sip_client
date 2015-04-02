var SipClient = require('./index.js');
var sip_client = new SipClient("200.255.100.116","5060","mrfoobar","slapboat");

sip_client.connect();
sip_client.on('connection_established', function () {
  sip_client.ping_server();
  /*
  sip_client.register();
  sip_client.on('registration_successful', function () {
    sip_client.place_call('666');
  });
  */
});
