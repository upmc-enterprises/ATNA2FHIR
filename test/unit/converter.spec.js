let atna2fhir = require('../../lib/converter');

describe('Convert ATNA AuditMessage to FHIR AuditEvent', () => {
    let auditMessage =
        `<AuditMessage>
            <EventIdentification EventActionCode="E"
                EventDateTime="2014-11-10T12:00:00.500-08:00" EventOutcomeIndicator="0">
                <EventID csd-code="110100" codeSystemName="DCM" originalText="Application Activity"/>
                <EventTypeCode csd-code="110120" codeSystemName="DCM" originalText="Application Start"/>
            </EventIdentification>
            <ActiveParticipant AlternativeUserID="alt@user"
                NetworkAccessPointID="10.145.240.60"
                NetworkAccessPointTypeCode="2" UserID="root" UserIsRequestor="false">
                <RoleIDCode csd-code="110150" codeSystemName="DCM" originalText="Application"/>
            </ActiveParticipant>
            <AuditSourceIdentification code="4" AuditSourceID="10.0.0.1@ACCT"/>
        </AuditMessage>`;

    let expectedFhirAuditEvent = {"resourceType":"AuditEvent","type":{"system":"DCM","code":"110100"},"period":"2014-11-10T12:00:00.500-08:00","outcome":"0","agent":[{"who":{"identifier":{"value":"root"}},"requestor":false,"network":{"address":"10.145.240.60","type":"2"}}],"source":{"observer":{"identifier":{"value":"10.0.0.1@ACCT"}}}};

    it('should return convert ATNA AuditMessage to FHIR AuditEvent', async () => {
        let converter = new atna2fhir();
        let actualFhirAuditEvent = await converter.convert(auditMessage);
        expect(actualFhirAuditEvent).toEqual(expectedFhirAuditEvent);
    });
});