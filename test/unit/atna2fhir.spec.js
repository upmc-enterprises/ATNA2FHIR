const fs = require('fs')
const converter = require('../../lib')

describe('Converts ATNA AuditMessages to FHIR AuditEvents', () => {
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

  describe('A "basic" ATNA AuditMessage', () => {
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/basic-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/basic-atna.xml')

    it('sets .recorded to the result of new Date().toISOString()', async () => {
      const auditEvent = await converter.convert(atna)
      expect(auditEvent.recorded).toEqual(dateRightNowIsoString)
    })

    it('maps the the basic ATNA AuditMessage to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })

  describe('A PDQ ATNA AuditMessage', () => {
    const fhir = JSON.parse(fs.readFileSync('test/unit/data/pdq-fhir.json'))
    const atna = fs.readFileSync('test/unit/data/pdq-atna.xml')

    it('maps the the PDQ ATNA AuditMessage to a FHIR AuditEvent', async () => {
      const auditEvent = await converter.convert(atna)
      // set the expected recordedDate time here, as it varies each run
      fhir.recorded = dateRightNowIsoString
      expect(auditEvent).toEqual(fhir)
    })
  })
})
