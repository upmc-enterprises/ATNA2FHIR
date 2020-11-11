# ATNA2FHIR
ATNA2FHIR converts audit logs that adhere to the [ATNA](https://wiki.ihe.net/index.php/Audit_Trail_and_Node_Authentication) [Audit Trail Message Format](http://dicom.nema.org/medical/dicom/current/output/html/part15.html#sect_A.5) into [HL7 FHIR](https://hl7.org/FHIR/) [AuditEvent](https://hl7.org/FHIR/auditevent.html) resources.

## Installing

Using npm:

```bash
$ npm install @upmc-enterprises/atna2fhir
```

## Versioning
ATNA2FHIR Version |     FHIR Version      |
------------------|-----------------------|
**1.0.x**         | R4                    |  

## Usage
````javascript
let converter = require('atna2fhir')

let xml = `<AuditMessage>
    <EventIdentification EventActionCode="E"
        EventDateTime="2014-11-10T12:00:00.500-08:00" EventOutcomeIndicator="0">
        <EventID csd-code="110100" codeSystemName="DCM" originalText="Application Activity"/>
        <EventTypeCode csd-code="110120" codeSystemName="DCM" originalText="Application Start"/>
		<EventOutcomeDescription>description</EventOutcomeDescription>
        <EventPurposeOfUse csd-code="HMARKT" codeSystemName="http://terminology.hl7.org/CodeSystem/v3-ActReason" originalText="healthcare marketing"/>
    </EventIdentification>
    <ActiveParticipant AlternativeUserID="alt@user"
        NetworkAccessPointID="10.145.240.60"
        NetworkAccessPointTypeCode="2" UserID="root" UserIsRequestor="false">
        <RoleIDCode csd-code="110150" codeSystemName="DCM" originalText="Application"/>
        <MediaIdentifier>
            <MediaType csd-code="110030" codeSystemName="DCM" originalText="USB Disk Emulation"/>
        </MediaIdentifier>
    </ActiveParticipant>
    <AuditSourceIdentification code="4" AuditSourceID="10.0.0.1@ACCT">
        <AuditSourceTypeCode csd-code="9" codeSystemName="DCM" originalText="Other" />
    </AuditSourceIdentification>
	<ParticipantObjectIdentification ParticipantObjectID="1.2.840.10008.2.3.4.5.6.7.78.8" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="3" ParticipantObjectDataLifeCycle="1">
		<ParticipantObjectIDTypeCode code="110180" codeSystemName="DCM" displayName="Study Instance UID"/>
		<ParticipantObjectDescription>
			<MPPS UID="1.2.840.10008.1.2.3.4.5"/>
			<Accession Number="12341234" />
			<SOPClass UID="1.2.840.10008.5.1.4.1.1.2" NumberOfInstances="1500"/>
			<SOPClass UID="1.2.840.10008.5.1.4.1.1.11.1" NumberOfInstances="3"/>
		</ParticipantObjectDescription>
	</ParticipantObjectIdentification>    
</AuditMessage>`

let result

// With promises
converter.convert(xml).then((response) => {
  result = response
  console.log(JSON.stringify(result))
})

// With async/await
result = await converter.convert(xml)
console.log(JSON.stringify(result))
````