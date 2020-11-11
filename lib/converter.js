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
    this.mapAgent(AuditMessage, auditEvent)
    this.mapSource(AuditMessage, auditEvent)
    this.mapEntity(AuditMessage, auditEvent)
    return auditEvent
  }

  mapText (AuditMessage, auditEvent) {
    const text = {}
    text.status = 'generated'
    text.div = '<div></div>'
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
      if (EventIdentification.hasOwnProperty.EventTypeCode && EventIdentification.EventTypeCode.length > 0) {
        const EventTypeCode = EventIdentification.EventTypeCode[0]
        const subtypes = []
        if (EventTypeCode.$['csd-code'] || EventTypeCode.$.codeSystemName || EventTypeCode.$.originalText) {
          const subtype = {}
          if (EventTypeCode.$['csd-code']) { subtype.code = EventTypeCode.$['csd-code'] }
          if (EventTypeCode.$.codeSystemName) { subtype.system = EventTypeCode.$.codeSystemName }
          if (EventTypeCode.$.originalText) { subtypes.display = EventTypeCode.$.originalText }

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
    // TODO
  }

  mapAgent (AuditMessage, auditEvent) {
    const agents = []

    if (Object.prototype.hasOwnProperty.call(AuditMessage, 'ActiveParticipant')) {
      AuditMessage.ActiveParticipant.forEach((ap) => {
        const agent = {}

        // type
        if (ap.$.RoleIDCode) {
          agent.type = ap.$.RoleIDCode
        }

        // role
        if (ap.$.RoleIDCode) {
          agent.role = [{ code: ap.$.RoleIDCode }]
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
        if (ap.$.AlternativeUserId) {
          agent.altId = ap.$.AlternativeUserId
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
        // TODO

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
        // TODO
        // if(AuditSourceIdentification.hasOwnProperty["AuditSourceTypeCode"] && AuditSourceIdentification.AuditSourceTypeCode.length > 0) {

        // }

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
