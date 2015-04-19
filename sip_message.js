var SipHelper = require('./sip_helper.js');

SipMessage.prototype.set_content = function ( content ) {
  this.content = '\n' + content;
}

SipMessage.prototype.to_s = function () {
  var buffer = new Buffer(this.content);
  return this.message_string 
         + 'Content-Length: ' + buffer.length
         + '\n' + this.content + '\n'
}

function SipMessage ( template, hash, sequence_number ) {
  this.content          = '';
  this.sequence_number  = sequence_number ? sequence_number : 101;

  hash['sequence_number'] = this.sequence_number;
  this.message_string   = SipHelper.replace_values(template,hash);
}
module.exports = SipMessage;
