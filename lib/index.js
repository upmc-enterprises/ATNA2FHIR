const xml2js = require('xml2js');
const Converter = require('./converter');

async function convert(raw) {

  let parser = new xml2js.Parser(/* options */);

  let converter = new Converter()

  try {
    let parsed = await parser.parseStringPromise(raw)
    let AuditMessage = parsed.AuditMessage
    let AuditEvent = await converter.convert(AuditMessage)
    return AuditEvent
  } catch (e) {
    throw e
  }
}


module.exports.convert = convert
