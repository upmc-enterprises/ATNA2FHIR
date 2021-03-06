const enums = require('./enums')

class Converter {
  async convert (AuditMessage) {
    const auditEvent = {
      resourceType: 'AuditEvent'
    }

    this.mapText(AuditMessage, auditEvent)
    this.mapType(AuditMessage, auditEvent)
    this.mapSubType(AuditMessage, auditEvent)
    this.mapAction(AuditMessage, auditEvent)
    this.mapPeriod(AuditMessage, auditEvent)
    this.mapRecorded(AuditMessage, auditEvent)
    this.mapOutcome(AuditMessage, auditEvent)
    this.mapOutcomeDesc(AuditMessage, auditEvent)
    this.mapPurposeOfEvent(AuditMessage, auditEvent)
    this.mapAgent(AuditMessage, auditEvent)
    this.mapSource(AuditMessage, auditEvent)
    this.mapEntity(AuditMessage, auditEvent)
    return auditEvent
  }

  mapText (AuditMessage, auditEvent) {
    const text = {}
    text.status = 'generated'
    text.div = '<div xmlns=\'http://www.w3.org/1999/xhtml\'>Audit Event</div>'
    auditEvent.text = text
  }

  mapType (AuditMessage, auditEvent) {
    const type = {}
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (
        Object.prototype.hasOwnProperty.call(EventIdentification, 'EventID') &&
        EventIdentification.EventID.length > 0
      ) {
        const EventID = EventIdentification.EventID[0]
        if (EventID.$) {
          if (EventID.$.codeSystemName && EventID.$.codeSystemName.toLowerCase() === 'dcm') {
            type.system = enums.CODING_SYSTEM_DCM
          }
          if (EventID.$['csd-code']) {
            type.code = EventID.$['csd-code']
          }
          if (EventID.$.displayName || EventID.$.originalText) {
            type.display = EventID.$.displayName || EventID.$.originalText
          }
          if (Object.keys(type).length > 0) {
            auditEvent.type = type
          }
        }
      }
    }
  }

  mapSubType (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (
        Object.prototype.hasOwnProperty.call(EventIdentification, 'EventTypeCode') &&
        EventIdentification.EventTypeCode.length > 0
      ) {
        const subtypes = []
        for (let i = 0; i < EventIdentification.EventTypeCode.length; i++) {
          const EventTypeCode = EventIdentification.EventTypeCode[parseInt(i)]
          if (EventTypeCode.$) {
            const subtype = {}
            if (EventTypeCode.$['csd-code']) {
              subtype.code = EventTypeCode.$['csd-code']
            }
            if (EventTypeCode.$.codeSystemName.toLowerCase() === 'dcm') {
              subtype.system = enums.CODING_SYSTEM_DCM
            } else {
              subtype.system = EventTypeCode.$.codeSystemName
            }
            if (EventTypeCode.$.originalText) {
              subtype.display = EventTypeCode.$.originalText
            }
            if (Object.keys(subtype).length > 0) {
              subtypes.push(subtype)
            }
          }
        }
        if (subtypes.length > 0) {
          auditEvent.subtype = subtypes
        }
      }
    }
  }

  mapAction (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$ && EventIdentification.$.EventActionCode) {
        auditEvent.action = EventIdentification.$.EventActionCode
      }
    }
  }

  mapPeriod (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$ && EventIdentification.$.EventDateTime) {
        auditEvent.period = {
          end: EventIdentification.$.EventDateTime
        }
      }
    }
  }

  mapRecorded (AuditMessage, auditEvent) {
    // not 100% sure that this needs to be a timestamp. It makes just as much sense to be mapped from the DICOM.EventDateTime
    auditEvent.recorded = new Date().toISOString()
  }

  mapOutcome (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$ && EventIdentification.$.EventOutcomeIndicator) {
        auditEvent.outcome = EventIdentification.$.EventOutcomeIndicator
      }
    }
  }

  mapOutcomeDesc (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (
        Object.prototype.hasOwnProperty.call(EventIdentification, 'EventOutcomeDescription') &&
        EventIdentification.EventID.length > 0
      ) {
        const EventOutcomeDescription = EventIdentification.EventOutcomeDescription[0]
        if (EventOutcomeDescription) {
          auditEvent.outcomeDesc = EventOutcomeDescription
        }
      }
    }
  }

  mapPurposeOfEvent (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') &&
      AuditMessage.EventIdentification.length > 0
    ) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (
        Object.prototype.hasOwnProperty.call(EventIdentification, 'EventPurposeOfUse') &&
        EventIdentification.EventID.length > 0
      ) {
        const purposeOfUseCodings = []
        for (let i = 0; i < EventIdentification.EventPurposeOfUse.length; i++) {
          const EventPurposeOfUse = EventIdentification.EventPurposeOfUse[parseInt(i)]
          const purposeOfUseCoding = {}
          if (EventPurposeOfUse.$['csd-code']) {
            purposeOfUseCoding.code = EventPurposeOfUse.$['csd-code']
          }
          if (EventPurposeOfUse.$.codeSystemName) {
            purposeOfUseCoding.system = EventPurposeOfUse.$.codeSystemName
          }
          if (EventPurposeOfUse.$.originalText) {
            purposeOfUseCoding.display = EventPurposeOfUse.$.originalText
          }

          if (Object.keys(purposeOfUseCoding).length > 0) {
            purposeOfUseCodings.push(purposeOfUseCoding)
          }
        }

        if (purposeOfUseCodings.length > 0) {
          auditEvent.purposeOfEvent = { coding: purposeOfUseCodings }
        }
      }
    }
  }

  mapAgent (AuditMessage, auditEvent) {
    const agents = []

    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'ActiveParticipant')) {
      AuditMessage.ActiveParticipant.forEach((ap) => {
        const agent = {}

        if (Object.prototype.hasOwnProperty.call(ap, 'RoleIDCode') && ap.RoleIDCode.length > 0) {
          const codings = []
          ap.RoleIDCode.forEach((code) => {
            const RoleIDCode = code
            const agentType = {}
            if (RoleIDCode.$) {
              if (RoleIDCode.$['csd-code']) {
                agentType.code = RoleIDCode.$['csd-code']
              }
              if (RoleIDCode.$.codeSystemName) {
                if (RoleIDCode.$.codeSystemName.toLowerCase() === 'dcm') {
                  agentType.system = enums.CODING_SYSTEM_DCM
                } else {
                  agentType.system = RoleIDCode.$.codeSystemName
                }
              }
              if (RoleIDCode.$.originalText) {
                agentType.display = RoleIDCode.$.originalText
              }
              if (Object.keys(agentType).length > 0) {
                codings.push(agentType)
              }
            }
          })

          if (codings.length > 0) {
            agent.type = { coding: codings }
            agent.role = [{ coding: codings }]
          }
        }

        // who
        if (ap.$ && ap.$.UserID) {
          agent.who = {
            identifier: {
              value: ap.$.UserID
            }
          }
        }

        // altId
        if (ap.$ && ap.$.AlternativeUserID) {
          agent.altId = ap.$.AlternativeUserID
        }

        // name
        if (ap.$ && ap.$.UserName) {
          agent.name = ap.$.UserName
        }

        // requestor
        if (ap.$ && ap.$.UserIsRequestor) {
          agent.requestor = ap.$.UserIsRequestor.toLowerCase() === 'true'
        }

        // policy
        // TODO

        // media
        if (Object.prototype.hasOwnProperty.call(ap, 'MediaIdentifier') && ap.MediaIdentifier.length > 0) {
          for (
            let mediaIdentifierIndex = 0;
            mediaIdentifierIndex < ap.MediaIdentifier.length;
            mediaIdentifierIndex++
          ) {
            const MediaIdentifier = ap.MediaIdentifier[parseInt(mediaIdentifierIndex)]

            if (
              Object.prototype.hasOwnProperty.call(MediaIdentifier, 'MediaType') &&
              MediaIdentifier.MediaType.length > 0
            ) {
              for (
                let mediaTypeIndex = 0;
                mediaTypeIndex < MediaIdentifier.MediaType.length;
                mediaTypeIndex++
              ) {
                const MediaType = MediaIdentifier.MediaType[parseInt(mediaTypeIndex)]

                agent.media = {}
                if (MediaType.$.codeSystemName && MediaType.$.codeSystemName.toLowerCase() === 'dcm') {
                  agent.media.system = enums.CODING_SYSTEM_DCM
                } else {
                  agent.media.system = MediaType.$.codeSystemName
                }
                agent.media.code = MediaType.$['csd-code']
                agent.media.display = MediaType.$.originalText
              }
            }
          }
        }

        const network = {}

        if (ap.$ && ap.$.NetworkAccessPointID) {
          network.address = ap.$.NetworkAccessPointID
        }

        if (ap.$ && ap.$.NetworkAccessPointTypeCode) {
          network.type = ap.$.NetworkAccessPointTypeCode
        }

        if (Object.keys(network).length > 0) {
          agent.network = network
        }

        if (Object.keys(agent).length > 0) {
          agents.push(agent)
        }
      })
    }

    if (agents.length > 0) {
      auditEvent.agent = agents
    }
  }

  mapSource (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'AuditSourceIdentification') &&
      AuditMessage.AuditSourceIdentification.length > 0
    ) {
      const AuditSourceIdentification = AuditMessage.AuditSourceIdentification[0]

      const source = {}
      // site
      if (AuditSourceIdentification.$ && AuditSourceIdentification.$.AuditEnterpriseSiteID) {
        source.site = AuditSourceIdentification.$.AuditEnterpriseSiteID
      }

      // observer
      if (AuditSourceIdentification.$ && AuditSourceIdentification.$.AuditSourceID) {
        source.observer = {
          identifier: {
            value: AuditSourceIdentification.$.AuditSourceID
          }
        }
      }

      if (Object.keys(source).length > 0) {
        // type
        if (
          Object.prototype.hasOwnProperty.call(AuditSourceIdentification, 'AuditSourceTypeCode') &&
          AuditSourceIdentification.AuditSourceTypeCode.length > 0
        ) {
          const types = []

          AuditSourceIdentification.AuditSourceTypeCode.forEach((item) => {
            const AuditSourceTypeCode = item

            const type = {}
            if (AuditSourceTypeCode.$) {
              if (AuditSourceTypeCode.$['csd-code']) {
                type.code = AuditSourceTypeCode.$['csd-code']
              }
              if (AuditSourceTypeCode.$.codeSystemName) {
                if (AuditSourceTypeCode.$.codeSystemName.toLowerCase() === 'dcm') {
                  type.system = enums.CODING_SYSTEM_HL7_SECURITY_SOURCE_TYPE // NOT sure if this is the proper system but HAPI rejects validation if it is DICOM url
                } else {
                  type.system = AuditSourceTypeCode.$.codeSystemName
                }
              }
              if (AuditSourceTypeCode.$.originalText) {
                type.display = AuditSourceTypeCode.$.originalText
              }
              if (Object.keys(type).length > 0) {
                types.push(type)
              }
            }
          })

          if (types.length > 0) {
            source.type = types
          }
        }
        auditEvent.source = source
      }
    }
  }

  mapEntity (AuditMessage, auditEvent) {
    if (
      Object.prototype.hasOwnProperty.call(AuditMessage, 'ParticipantObjectIdentification') &&
      AuditMessage.ParticipantObjectIdentification.length > 0
    ) {
      const entities = []

      AuditMessage.ParticipantObjectIdentification.forEach((poi) => {
        const entity = {}

        // what
        if (poi.$ && poi.$.ParticipantObjectID) {
          entity.what = {
            identifier: {
              value: poi.$.ParticipantObjectID
            }
          }
          if (
            Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectIDTypeCode') &&
            poi.ParticipantObjectIDTypeCode.length > 0
          ) {
            const participantObjectIdTypeCode = poi.ParticipantObjectIDTypeCode[0]

            if (participantObjectIdTypeCode.$) {
              const type = {}

              if (participantObjectIdTypeCode.$.originalText) {
                type.text = participantObjectIdTypeCode.$.originalText
              }

              if (participantObjectIdTypeCode.$['csd-code'] || participantObjectIdTypeCode.$.codeSystemName) {
                const coding = {}

                if (participantObjectIdTypeCode.$['csd-code']) {
                  coding.code = participantObjectIdTypeCode.$['csd-code']
                }

                if (participantObjectIdTypeCode.$.codeSystemName.toLowerCase() === 'dcm') {
                  coding.system = enums.CODING_SYSTEM_HL7_SECURITY_SOURCE_TYPE
                } else {
                  coding.system = participantObjectIdTypeCode.$.codeSystemName
                }

                if (Object.keys(coding).length > 0) {
                  type.coding = [
                    coding
                  ]
                }
              }

              if (Object.keys(type).length > 0) {
                entity.what.identifier.type = type
              }
            }
          }
        }

        // type
        if (poi.$ && poi.$.ParticipantObjectTypeCode) {
          entity.type = {
            code: poi.$.ParticipantObjectTypeCode
          }
        }

        // role
        if (poi.$ && poi.$.ParticipantObjectTypeCodeRole) {
          entity.role = {
            code: poi.$.ParticipantObjectTypeCodeRole
          }
        }

        // lifecycle
        if (poi.$ && poi.$.ParticipantObjectDataLifeCycle) {
          entity.lifecycle = {
            code: poi.$.ParticipantObjectDataLifeCycle
          }
        }

        // security label
        if (poi.$ && poi.$.ParticipantObjectSensitivity) {
          entity.securityLabel = [{ code: poi.$.ParticipantObjectSensitivity }]
        }

        // name
        if (
          Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectName') &&
          poi.ParticipantObjectName.length > 0
        ) {
          entity.name = poi.ParticipantObjectName[0]
        }

        // description
        // TODO

        // query (skip if name is already mapped so it doesn't throw a validation error)
        if (
          !entity.name &&
          Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectQuery') &&
          poi.ParticipantObjectQuery.length > 0
        ) {
          entity.query = poi.ParticipantObjectQuery[0]
        }

        // detail
        if (
          Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectDetail') &&
          poi.ParticipantObjectDetail.length > 0
        ) {
          const entityDetails = []
          for (let i = 0; i < poi.ParticipantObjectDetail.length; i++) {
            const ParticipantObjectDetail = poi.ParticipantObjectDetail[parseInt(i)]
            const detail = {}
            if (ParticipantObjectDetail.$) {
              if (ParticipantObjectDetail.$.type) {
                detail.type = ParticipantObjectDetail.$.type
              }
              if (ParticipantObjectDetail.$.value) {
                detail.valueString = ParticipantObjectDetail.$.value
              }
              if (Object.keys(detail).length > 0) {
                entityDetails.push(detail)
              }
            }
          }
          if (entityDetails.length > 0) {
            entity.detail = entityDetails
          }
        }

        entities.push(entity)
      })

      if (entities.length > 0) {
        auditEvent.entity = entities
      }
    }
  }
}

module.exports = Converter
