const xml2js = require('xml2js')
const Converter = require('./converter')

async function convert (raw) {
  const parser = new xml2js.Parser(/* options */)

  const converter = new Converter()

  const parsed = await parser.parseStringPromise(raw)
  const AuditMessage = parsed.AuditMessage
  const AuditEvent = await converter.convert(AuditMessage)
  return AuditEvent
}

module.exports.convert = convert
