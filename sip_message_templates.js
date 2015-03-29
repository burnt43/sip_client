module.exports.options = 
    'OPTIONS sip:$DESTINATION_ADDRESS SIP/2.0\n'
  + 'Via: SIP/2.0/UDP $SOURCE_ADDRESS:$SOURCE_PORT;branch=z9hG4bK26534f84\n'
  + 'Max-Forwards: 70\n'
  + 'From: "unknown" <sip:unknown@$SOURCE_ADDRESS:$SOURCE_PORT>;tag=ba456efda3\n'
  + 'To: <sip:$DESTINATION_ADDRESS>\n'
  + 'Contact: <sip:unknown@$SOURCE_ADDRESS:$SOURCE_PORT>\n'
  + 'Call-ID: $SIP_CALLID\n'
  + 'CSeq: 102 OPTIONS\n'
  + 'User-Agent: James\n'
  + 'Accept: text/plain\n'
  + 'Content-Length: 0\n';

module.exports.register =
    'REGISTER sip:$DESTINATION_ADDRESS SIP/2.0\n'
  + 'Via: SIP/2.0/UDP $SOURCE_ADDRESS:$SOURCE_PORT;branch=z9hG4bK26534f84\n'
  + 'From: "unknown" <sip:$SIP_USER_NAME@$DESTINATION_ADDRESS>;tag=3ceca9d67449aac6o0\n'
  + 'To: "unknown" <sip:$SIP_USER_NAME@$DESTINATION_ADDRESS>\n'
  + 'Call-ID: $SIP_CALLID\n'
  + 'CSeq: 60591 REGISTER\n'
  + 'Contact: "unknown" <sip:$SIP_USER_NAME@$SOURCE_ADDRESS>;expires=300\n'
  + 'Authorization: Digest username="$SIP_USER_NAME", realm="asterisk", nonce="$SIP_NONCE", uri="sip:$DESTINATION_ADDRESS", response="$SIP_RESPONSE", algorithm=MD5\n'
  + 'Allow: ACK, BYE, CANCEL, INFO, INVITE, NOTIFY, OPTIONS, REFER, UPDATE\n'
  + 'Max-forwards: 69\n'
  + 'User-agent: foobar\n'
  + 'Supported: replaces\n'
  + 'Content-Length: 0\n';

module.exports.invite = 
    'INVITE sip:$DIALED_NUMBER@$DESTINATION_ADDRESS SIP/2.0\n'
  + 'Via: SIP/2.0/UDP $SOURCE_ADDRESS:$SOURCE_PORT;branch=z9hG4bK724f4c9aa009d48\n'
  + 'From: "unknown" <sip:$SIP_USER_NAME@$DESTINATION_ADDRESS>;tag=a2b9001e1656b3234\n'
  + 'To: "unknown" <sip:$DIALED_NUMBER@$DESTINATION_ADDRESS>\n'
  + 'Call-ID: $SIP_CALLID\n'
  + 'CSeq: 101 INVITE\n'
  + 'Contact: "unknown" <sip:$SIP_USER_NAME@$SOURCE_ADDRESS>\n'
  + 'Content-Type: application/sdp\n'
  + 'Allow: ACK, BYE, CANCEL, INFO, INVITE, NOTIFY, OPTIONS, REFER, UPDATE\n'
  + 'Max-forwards: 69\n'
  + 'Expires: 240\n'
  + 'User-agent: foobar\n'
  + 'Supported: replaces\n'
  + 'Content-Length: 0\n';

/* SDP STUFF
  v=0
  o=- 1749557 1749557 IN IP4 $SOURCE_ADDRESS
  s=-
  c=IN IP4 $SOURCE_ADDRESS
  t=0 0
  m=audio 10118 RTP/AVP 0 2 8 9 18 101
  a=rtpmap:0 PCMU/8000
  a=rtpmap:2 G726-32/8000
  a=rtpmap:8 PCMA/8000
  a=rtpmap:9 G722/8000
  a=rtpmap:18 G729a/8000
  a=rtpmap:101 telephone-event/8000
  a=fmtp:101 0-15
  a=ptime:20
  a=sendrecv
*/
