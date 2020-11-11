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
    </EventIdentification>
    <ActiveParticipant AlternativeUserID="alt@user"
        NetworkAccessPointID="10.145.240.60"
        NetworkAccessPointTypeCode="2" UserID="root" UserIsRequestor="false">
        <RoleIDCode csd-code="110150" codeSystemName="DCM" originalText="Application"/>
    </ActiveParticipant>
    <AuditSourceIdentification code="4" AuditSourceID="10.0.0.1@ACCT"/>
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