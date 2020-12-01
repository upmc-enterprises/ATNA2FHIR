const { v4: uuidv4 } = require('uuid')

class Wrapper {
  wrapInABundleTransaction (auditEvent) {
    const result = {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: [
        {
          fullUrl: `urn:uuid:${uuidv4()}`,
          resource: auditEvent,
          request: {
            method: 'POST',
            url: 'AuditEvent'
          }
        }
      ]
    }
    return result
  }
}

module.exports = Wrapper
