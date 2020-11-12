const fs = require('fs')
const converter = require('../../lib')

describe('Converts ATNA AuditMessages to FHIR AuditEvents', () => {
  describe('Converts ATNA AuditMessage Event Code "E" to FHIR AuditEvent', () => {
    const expectedFhirAuditEvent = JSON.parse(fs.readFileSync('test/unit/data/basic-fhir.json'))
    const rawAuditMessage = fs.readFileSync('test/unit/data/basic-atna.xml')
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

    it('maps the a basic ATNA AuditMessage to FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(rawAuditMessage)
      // set the expected recordedDate time here, as it varies each run
      expectedFhirAuditEvent.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(expectedFhirAuditEvent)
    })

    it('maps the an ATNA PDQ AuditMessage to FHIR AuditEvent', async () => {
      const fhir = JSON.parse(fs.readFileSync('test/unit/data/pdq-fhir.json'))
      const atna = fs.readFileSync('test/unit/data/pdq-atna.xml')

      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })
})
