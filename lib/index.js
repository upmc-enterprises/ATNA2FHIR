const xml2js = require('xml2js')
const Converter = require('./converter')
const Wrapper = require('./wrapper')

async function convert (raw) {
  const parser = new xml2js.Parser()

  const converter = new Converter()

  const parsed = await parser.parseStringPromise(raw)
  const AuditMessage = parsed.AuditMessage
  const AuditEvent = await converter.convert(AuditMessage)
  return AuditEvent
}

function wrapInBundle (auditEvent) {
  const wrapper = new Wrapper()
  const result = wrapper.wrapInABundle(auditEvent)
  return result
}

module.exports.convert = convert
module.exports.wrapInABundle = wrapInBundle
