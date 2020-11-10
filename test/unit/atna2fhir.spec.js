const fs = require('fs')
const converter = require('../../lib')

describe('Converts ATNA AuditMessages to FHIR AuditEvents', () => {
  describe('Converts ATNA AuditMessage Event Code "E" to FHIR AuditEvent', () => {
    const expectedFhirAuditEvent = JSON.parse(fs.readFileSync('test/unit/data/fhir.json'))
    const rawAuditMessage = fs.readFileSync('test/unit/data/atna.xml')
    const dateRightNowIsoString = 'mock iso string representation of date right now'
    beforeEach(() => {
      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => {
          return {
            toISOString: () => dateRightNowIsoString
          }
        })
    })

    it('sets .recorded to the result of new Date().toISOString()', async () => {
      const auditEvent = await converter.convert(rawAuditMessage)
      expect(auditEvent.recorded).toEqual(dateRightNowIsoString)
    })

    it('maps the ATNA message to FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(rawAuditMessage)
      // set the expected recordedDate time here, as it varies each run
      expectedFhirAuditEvent.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(expectedFhirAuditEvent)
    })
  })
})
