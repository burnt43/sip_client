var dgram = require('dgram');
var EventEmitter = require('events').EventEmitter;
var destination_host, destination_port, socket;
var source_host, source_port;

module.exports = new EventEmitter();

module.exports.create = function (host,port) {
  destination_host = host;
  destination_port = port;

  socket = dgram.createSocket('udp4');
  socket.bind(null, 'localhost',  function () {
    source_host = socket.address().address;
    source_port = socket.address().port;
    module.exports.emit('ready');
  });
  socket.on('message', function (data,info) {
    console.log(data.toString());
  });
};

module.exports.options = function () {
  var message = new Buffer('OPTIONS sip:' + destination_host + ' SIP/2.0\n' +
    'Via: SIP/2.0/UDP ' + source_host + ':' + source_port + ';branch=z9hG4bK26534f84\n' +
    'Max-Forwards: 70\n' +
    'From: "unknown" <sip:unknown@' + source_host + ':' + source_port + '>;tag=ba456efda3\n' +
    'To: <sip:' + destination_host + '>\n' +
    'Contact: <sip:unknown@' + source_host + ':' + source_port + '>\n' +
    'Call-ID: 52094582094832@' + source_host + ':' + source_port + '\n' +
    'CSeq: 102 OPTIONS\n' +
    'User-Agent: James\n' +
    'Accept: text/plain\n' + 
    'Content-Length: 0\n'
  );
  socket.send(message, 0, message.length, destination_port, destination_host, function (err) {});
};
