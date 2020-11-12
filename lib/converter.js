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
    text.div = "<div xmlns='http://www.w3.org/1999/xhtml'>Audit Event</div>"
    auditEvent.text = text
  }

  mapType (AuditMessage, auditEvent) {
    const type = {}
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (Object.prototype.hasOwnProperty.call(EventIdentification, 'EventID') && EventIdentification.EventID.length > 0) {
        const EventID = EventIdentification.EventID[0]
        if (EventID.$.codeSystemName && EventID.$.codeSystemName.toLowerCase() === 'dcm') {
          type.system = enums.CODING_SYSTEM_DCM
        }
        if (EventID.$['csd-code']) {
          type.code = EventID.$['csd-code']
        }
        if (EventID.$.displayName) {
          type.display = EventID.$.displayName
        }
      }
    }
    if (Object.keys(type).length > 0) {
      auditEvent.type = type
    }
  }

  mapSubType (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (Object.prototype.hasOwnProperty.call(EventIdentification, 'EventTypeCode') && EventIdentification.EventTypeCode.length > 0) {

        const subtypes = []
        for (let i = 0; i < EventIdentification.EventTypeCode.length; i++){
          const EventTypeCode = EventIdentification.EventTypeCode[i]
          const subtype = {}
          if (EventTypeCode.$['csd-code']) { subtype.code = EventTypeCode.$['csd-code'] }
          if (EventTypeCode.$.codeSystemName) { subtype.system = EventTypeCode.$.codeSystemName }
          if (EventTypeCode.$.originalText) { subtype.display = EventTypeCode.$.originalText }

          if (Object.keys(subtype).length > 0) {
            subtypes.push(subtype)
          }
        }

        if (subtypes.length > 0) { auditEvent.subtype = subtypes }
      }
    }
  }

  mapAction (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$.EventActionCode) {
        auditEvent.action = EventIdentification.$.EventActionCode
      }
    }
  }

  mapPeriod (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$.EventDateTime) {
        auditEvent.period = EventIdentification.$.EventDateTime
      }
    }
  }

  mapRecorded (AuditMessage, auditEvent) {
    // not 100% sure that this needs to be a timestamp. It makes just as much sense to be mapped from the DICOM.EventDateTime
    auditEvent.recorded = new Date().toISOString()
  }

  mapOutcome (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (EventIdentification.$.EventOutcomeIndicator) {
        auditEvent.outcome = EventIdentification.$.EventOutcomeIndicator
      }
    }
  }

  mapOutcomeDesc (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (Object.prototype.hasOwnProperty.call(EventIdentification, 'EventOutcomeDescription') && EventIdentification.EventID.length > 0) {
        const EventOutcomeDescription = EventIdentification.EventOutcomeDescription[0]
        if (EventOutcomeDescription) { auditEvent.outcomeDesc = EventOutcomeDescription }
      }
    }
  }

  mapPurposeOfEvent (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'EventIdentification') && AuditMessage.EventIdentification.length > 0) {
      const EventIdentification = AuditMessage.EventIdentification[0]
      if (Object.prototype.hasOwnProperty.call(EventIdentification, 'EventPurposeOfUse') && EventIdentification.EventID.length > 0) {

        const purposeOfUseCodings = []
        for (let i = 0; i < EventIdentification.EventPurposeOfUse.length; i++){
          const EventPurposeOfUse = EventIdentification.EventPurposeOfUse[i]
          const purposeOfUseCoding = {}
          if (EventPurposeOfUse.$['csd-code']) { purposeOfUseCoding.code = EventPurposeOfUse.$['csd-code'] }
          if (EventPurposeOfUse.$.codeSystemName) { purposeOfUseCoding.system = EventPurposeOfUse.$.codeSystemName }
          if (EventPurposeOfUse.$.originalText) { purposeOfUseCoding.display = EventPurposeOfUse.$.originalText }

          if (Object.keys(purposeOfUseCoding).length > 0) {
            purposeOfUseCodings.push(purposeOfUseCoding)
          }
        }

        if (purposeOfUseCodings.length > 0) { auditEvent.purposeOfEvent = { coding: purposeOfUseCodings } }
      }
    }
  }

  mapAgent (AuditMessage, auditEvent) {
    const agents = []

    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'ActiveParticipant')) {
      AuditMessage.ActiveParticipant.forEach((ap) => {
        const agent = {}

        if (Object.prototype.hasOwnProperty.call(ap, 'RoleIDCode') && ap.RoleIDCode.length > 0) {
          const RoleIDCode = ap.RoleIDCode[0]

          const agentType = {}
          if (RoleIDCode.$['csd-code']) { agentType.code = RoleIDCode.$['csd-code'] }

          if (RoleIDCode.$.codeSystemName) {
            if (RoleIDCode.$.codeSystemName.toLowerCase() === 'dcm') {
              agentType.system = enums.CODING_SYSTEM_DCM
            } else {
              agentType.system = RoleIDCode.$.codeSystemName
            }
          }
          if (RoleIDCode.$.originalText) { agentType.display = RoleIDCode.$.originalText }
          if (Object.keys(agentType).length > 0) {
            agent.type = agentType
            agent.role = agentType
          }
        }

        // who
        if (ap.$.UserID) {
          agent.who = {
            identifier: {
              value: ap.$.UserID
            }
          }
        }

        // altId
        if (ap.$.AlternativeUserID) {
          agent.altId = ap.$.AlternativeUserID
        }

        // name
        if (ap.$.UserName) {
          agent.name = ap.$.UserName
        }

        // requestor
        if (ap.$.UserIsRequestor) {
          agent.requestor = ap.$.UserIsRequestor.toLowerCase() === 'true'
        }

        // policy
        // TODO

        // media
        if (Object.prototype.hasOwnProperty.call(ap, 'MediaIdentifier') && ap.MediaIdentifier.length > 0) {
          const MediaIdentifier = ap.MediaIdentifier[0]

          if (Object.prototype.hasOwnProperty.call(MediaIdentifier, 'MediaType') && MediaIdentifier.MediaType.length > 0) {
            const MediaType = MediaIdentifier.MediaType[0]

            agent.media = {}
            if (MediaType.$.codeSystemName && MediaType.$.codeSystemName.toLowerCase() === 'dcm') {
              agent.media.system = enums.CODING_SYSTEM_DCM
            } else {
              agent.media.system = MediaType.$.codeSystemName;
            }
            agent.media.code = MediaType.$['csd-code']
            agent.media.display = MediaType.$.originalText

          }
        }

        if (ap.$.NetworkAccessPointID || ap.$.NetworkAccessPointTypeCode) {
          agent.network = {
            address: ap.$.NetworkAccessPointID,
            type: ap.$.NetworkAccessPointTypeCode
          }
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
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'AuditSourceIdentification') && AuditMessage.AuditSourceIdentification.length > 0) {
      const AuditSourceIdentification = AuditMessage.AuditSourceIdentification[0]

      if (AuditSourceIdentification.$.AuditSourceID || AuditSourceIdentification.$.AuditEnterpriseSiteID) {
        const source = {}

        // site
        if (AuditSourceIdentification.$.AuditEnterpriseSiteID) {
          source.site = AuditSourceIdentification.$.AuditEnterpriseSiteID
        }

        // observer
        if (AuditSourceIdentification.$.AuditSourceID) {
          source.observer = {
            identifier: {
              value: AuditSourceIdentification.$.AuditSourceID
            }
          }
        }

        // type
        if (Object.prototype.hasOwnProperty.call(AuditSourceIdentification, 'AuditSourceTypeCode') && AuditSourceIdentification.AuditSourceTypeCode.length > 0) {
          const AuditSourceTypeCode = AuditSourceIdentification.AuditSourceTypeCode[0]

          const type = {}
          if (AuditSourceTypeCode.$['csd-code']) { type.code = AuditSourceTypeCode.$['csd-code'] }
          if (AuditSourceTypeCode.$.codeSystemName) {
            if (AuditSourceTypeCode.$.codeSystemName.toLowerCase() === 'dcm') {
              type.system = enums.CODING_SYSTEM_HL7_SECURITY_SOURCE_TYPE // NOT sure if this is the proper system but HAPI rejects validation if it is DICOM url
            } else {
              type.system = AuditSourceTypeCode.$.codeSystemName
            }
          }
          if (AuditSourceTypeCode.$.originalText) { type.display = AuditSourceTypeCode.$.originalText }
          if (Object.keys(type).length > 0) {
            source.type = type
          }
        }

        if (Object.keys(source).length > 0) {
          auditEvent.source = source
        }
      }
    }
  }

  mapEntity (AuditMessage, auditEvent) {
    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'ParticipantObjectIdentification') && AuditMessage.ParticipantObjectIdentification.length > 0) {
      const entities = []

      AuditMessage.ParticipantObjectIdentification.forEach((poi) => {
        const entity = {}

        // what
        if (poi.$.ParticipantObjectID) {
          entity.what = {
            identifier: {
              value: poi.$.ParticipantObjectID
            }
          }
        }

        // type
        if (poi.$.ParticipantObjectTypeCode) {
          entity.type = {
            code: poi.$.ParticipantObjectTypeCode
          }
        }

        // role
        if (poi.$.ParticipantObjectTypeCodeRole) {
          entity.role = {
            code: poi.$.ParticipantObjectTypeCodeRole
          }
        }

        // lifecycle
        if (poi.$.ParticipantObjectDataLifeCycle) {
          entity.lifecycle = {
            code: poi.$.ParticipantObjectDataLifeCycle
          }
        }

        // security label
        if (poi.$.ParticipantObjectSensitivity) {
          entity.securityLabel = [{ code: poi.$.ParticipantObjectSensitivity }]
        }

        // name
        if (Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectName') && poi.ParticipantObjectName.length > 0) {
          entity.name = poi.ParticipantObjectName[0]
        }

        // description
        // TODO

        // query (skip if name is already mapped so it doesn't throw a validation error)
        if (!entity.name && Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectQuery') && poi.ParticipantObjectQuery.length > 0) {
          entity.query = poi.ParticipantObjectQuery[0]
        }

        // detail
        if (Object.prototype.hasOwnProperty.call(poi, 'ParticipantObjectDetail') && poi.ParticipantObjectDetail.length > 0) {
          const ParticipantObjectDetail = poi.ParticipantObjectDetail[0]

          if (ParticipantObjectDetail.$.type || ParticipantObjectDetail.$.value) {
            const detail = {}
            if (ParticipantObjectDetail.$.type) {
              detail.type = ParticipantObjectDetail.$.type
            }
            if (ParticipantObjectDetail.$.value) {
              detail.valueString = ParticipantObjectDetail.$.value
            }

            if (Object.keys(detail).length > 0) {
              entity.detail = detail
            }
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
