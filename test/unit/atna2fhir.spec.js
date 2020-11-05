const fs = require('fs');
const moment = require('moment');
const converter = require('../../lib');


describe('Convert ATNA AuditMessage to FHIR AuditEvent', () => {
    let rawAuditMessage = fs.readFileSync('test/unit/data/atna.xml');
    let expectedFhirAuditEvent = JSON.parse(fs.readFileSync('test/unit/data/fhir.json'));

    it('should return have a recorded time close to now()', async () => {
        const now = new Date();
        const actualFhirAuditEvent = await converter.convert(rawAuditMessage);

        // verify recorded is within N seconds of the test run
        const diffInSeconds = moment(actualFhirAuditEvent["recorded"]).diff(moment(now), 'seconds');
        const maxAllowedDiffInSeconds = 5;
        expect(diffInSeconds).toBeLessThanOrEqual(maxAllowedDiffInSeconds);
    });

    it('should return convert ATNA AuditMessage to FHIR AuditEvent', async () => {
        const actualFhirAuditEvent = await converter.convert(rawAuditMessage);

        // check to see if a recorded time exists
        expect(actualFhirAuditEvent["recorded"]).toBeDefined();

        // ignore the actual recorded time because it varies each run
        actualFhirAuditEvent["recorded"] = expectedFhirAuditEvent["recorded"];

        expect(actualFhirAuditEvent).toEqual(expectedFhirAuditEvent);
    });
});