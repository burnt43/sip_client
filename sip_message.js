var SipHelper = require('./sip_helper.js');

SipMessage.prototype.set_content = function ( content ) {
  this.content = content;
}

SipMessage.prototype.to_s = function () {
  return this.message_string 
         + '\nContent-Length: ' + this.content.length
         + '\n' + this.content
}

function SipMessage ( template,hash ) {
  this.message_string = SipHelper.replace_values(template,hash);
  this.content        = '';
}
module.exports = SipMessage;
