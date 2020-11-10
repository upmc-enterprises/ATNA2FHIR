## Installing

Using npm:

```bash
$ npm install @upmc-enterprises/atna2fhir
```

## Example
````javascript
let converter = require('atna2fhir')

let xml = `<AuditMessage>
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
</AuditMessage>`

converter.convert(xml).then((response) => {
  console.log(JSON.stringify(response))
})

// Want to use async/await?
const result = await converter.convert(xml)
````