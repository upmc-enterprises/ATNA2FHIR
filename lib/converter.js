class Converter {
	constructor() {}

	async convert(AuditMessage) {
		let auditEvent = {
			resourceType: 'AuditEvent'
		};

		this.mapType(AuditMessage, auditEvent);
		this.mapSubType(AuditMessage, auditEvent);
		this.mapAction(AuditMessage, auditEvent);
		this.mapPeriod(AuditMessage, auditEvent);
		this.mapOutcome(AuditMessage, auditEvent);
		this.mapOutcomeDesc(AuditMessage, auditEvent);
		this.mapAgent(AuditMessage, auditEvent);
		this.mapSource(AuditMessage, auditEvent);
		this.mapEntity(AuditMessage, auditEvent);
		return auditEvent;
	}

	mapType(AuditMessage, auditEvent) {
		let type = {};
		if (AuditMessage.hasOwnProperty('EventIdentification') && AuditMessage.EventIdentification.length > 0) {
			let EventIdentification = AuditMessage.EventIdentification[0];
			if (EventIdentification.hasOwnProperty('EventID') && EventIdentification.EventID.length > 0) {
				let EventID = EventIdentification.EventID[0];
				if (EventID.$['codeSystemName']) {
					type.system = EventID.$['codeSystemName'];
				}
				if (EventID.$['csd-code']) {
					type.code = EventID.$['csd-code'];
				}
				if (EventID.$['displayName']) {
					type.display = EventID.$['displayName'];
				}
			}
		}
		if (Object.keys(type).length > 0) {
			auditEvent.type = type;
		}
	}

	mapSubType(AuditMessage, auditEvent) {
     
		if(AuditMessage.hasOwnProperty('EventIdentification') && AuditMessage.EventIdentification.length >0) {
      let EventIdentification = AuditMessage.EventIdentification[0]
      if(EventIdentification.hasOwnProperty["EventTypeCode"] && EventIdentification.EventTypeCode.length > 0) {
        let EventTypeCode = EventIdentification.EventTypeCode[0]
        let subtypes = []
        if(EventTypeCode.$["csd-code"] || EventTypeCode.$["codeSystemName"] || EventTypeCode.$["originalText"]) {
          let subtype = {}
          if(EventTypeCode.$["csd-code"]) { subtype.code = EventTypeCode.$["csd-code"]}
          if(EventTypeCode.$["codeSystemName"]) { subtype.system = EventTypeCode.$["codeSystemName"] }
          if(EventTypeCode.$["originalText"] ) {subtypes.display = EventTypeCode.$["originalText"]}

          if (Object.keys(subtype).length > 0) {
            subtypes.push(subtype)
          }
        }
        if(subtypes.length > 0) { auditEvent.subtype = subtypes}
       
      }
    }
	}

	mapAction(AuditMessage, auditEvent) {
		// TODO
	}

	mapPeriod(AuditMessage, auditEvent) {
		if (AuditMessage.hasOwnProperty('EventIdentification') && AuditMessage.EventIdentification.length > 0) {
			let EventIdentification = AuditMessage.EventIdentification[0];
			if (EventIdentification.$['EventDateTime']) {
				auditEvent.period = EventIdentification.$['EventDateTime'];
			}
		}
	}

	mapOutcome(AuditMessage, auditEvent) {
		if (AuditMessage.hasOwnProperty('EventIdentification') && AuditMessage.EventIdentification.length > 0) {
			let EventIdentification = AuditMessage.EventIdentification[0];
			if (EventIdentification.$['EventOutcomeIndicator']) {
				auditEvent.outcome = EventIdentification.$['EventOutcomeIndicator'];
			}
		}
	}

	mapOutcomeDesc(AuditMessage, auditEvent) {
		// TODO
	}

	mapPurposeOfEvent(AuditMessage, auditEvent) {
		// TODO
	}

	mapAgent(AuditMessage, auditEvent) {
		let agents = [];

		if (AuditMessage.hasOwnProperty('ActiveParticipant')) {
			AuditMessage.ActiveParticipant.forEach((ap) => {
				let agent = {};

				// type
				if (ap.$['RoleIDCode']) {
					agent.type = ap.$['RoleIDCode'];
				}

				// role
				if (ap.$['RoleIDCode']) {
					agent.role = [ { code: ap.$['RoleIDCode'] } ];
				}

				// who
				if (ap.$['UserID']) {
					agent.who = {
						identifier: {
							value: ap.$.UserID
						}
					};
				}

				// altId
				if (ap.$['AlternativeUserId']) {
					agent.altId = ap.$['AlternativeUserId'];
				}

				// name
				if (ap.$['UserName']) {
					agent.name = ap.$['UserName'];
				}

				// requestor
				if (ap.$['UserIsRequestor']) {
					agent.requestor = ap.$['UserIsRequestor'].toLowerCase() == 'true';
				}

				// policy
				// TODO

				//media
				// TODO

				if (ap.$['NetworkAccessPointID'] || ap.$['NetworkAccessPointTypeCode']) {
					agent.network = {
						address: ap.$['NetworkAccessPointID'],
						type: ap.$['NetworkAccessPointTypeCode']
					};
				}

				if (Object.keys(agent).length > 0) {
					agents.push(agent);
				}
			});
		}

		if (agents.length > 0) {
			auditEvent.agent = agents;
		}
	}

	mapSource(AuditMessage, auditEvent) {


    
		if (AuditMessage.hasOwnProperty('AuditSourceIdentification') && AuditMessage.AuditSourceIdentification.length > 0) {

      let AuditSourceIdentification = AuditMessage.AuditSourceIdentification[0]

      if (AuditSourceIdentification.$["AuditSourceID"] || AuditSourceIdentification.$["AuditEnterpriseSiteID"]) {
        let source = {}

        // site
        if(AuditSourceIdentification.$["AuditEnterpriseSiteID"]) {
          source.site = AuditSourceIdentification.$["AuditEnterpriseSiteID"]
        }

        // observer
        if(AuditSourceIdentification.$["AuditSourceID"]) {
          source.observer = {
            identifier:  {
              value: AuditSourceIdentification.$["AuditSourceID"]
            }
          }
        }

        // type
        // TODO
        // if(AuditSourceIdentification.hasOwnProperty["AuditSourceTypeCode"] && AuditSourceIdentification.AuditSourceTypeCode.length > 0) {
          
        // }

        if (Object.keys(source).length > 0) {
	        auditEvent.source = source;
				}

      }

		}

	}

	mapEntity(AuditMessage, auditEvent) {

    if(AuditMessage.hasOwnProperty("ParticipantObjectIdentification") && AuditMessage.ParticipantObjectIdentification.length > 0) {

      let entities = [];

      AuditMessage.ParticipantObjectIdentification.forEach((poi) => {

        let entity = {};
  
        // what
        if(poi.$["ParticipantObjectID"]) {
          entity.what = {
            identifier: {
              value: poi.$["ParticipantObjectID"]
            }
          }
        }

        // type
        if (poi.$["ParticipantObjectTypeCode"]) {
          entity.type = {
            code: poi.$['ParticipantObjectTypeCode']
          };
        }
  
        // role
        if (poi.$["ParticipantObjectTypeCodeRole"]) {
          entity.role = {
            code: poi.$['ParticipantObjectTypeCodeRole']
          }
        }
        
        // lifecycle
        if(poi.$["ParticipantObjectDataLifeCycle"]) {
          entity.lifecycle = {
            code: poi.$['ParticipantObjectDataLifeCycle']
          }
        }
 
        // security label
        if(poi.$["ParticipantObjectSensitivity"]) {
          entity.securityLabel = [{code: poi.$["ParticipantObjectSensitivity"]}]
        }

        // name
        if(poi.hasOwnProperty("ParticipantObjectName") && poi.ParticipantObjectName.length > 0) {
          entity.name = poi.ParticipantObjectName[0];
        }
  
        // description
        // TODO

        // query
        if(poi.hasOwnProperty("ParticipantObjectQuery") && poi.ParticipantObjectQuery.length >0) {
          entity.query = poi.ParticipantObjectQuery[0];
        }
  
        // detail
        if(poi.hasOwnProperty("ParticipantObjectDetail") && poi.ParticipantObjectDetail.length > 0) {
          let ParticipantObjectDetail = poi.ParticipantObjectDetail[0]
          
          if(ParticipantObjectDetail.$["type"] || ParticipantObjectDetail.$["value"]) {
            let detail = {}
            if (ParticipantObjectDetail.$["type"]) {
              detail.type = ParticipantObjectDetail.$["type"]
            } 
            if(ParticipantObjectDetail.$["value"]) {
              detail.value = ParticipantObjectDetail.$["value"]
            }

            if (Object.keys(detail).length > 0) {
              entity.detail = detail
            }
          }
        }
  

        entities.push(entity);
      });
  
      if (entities.length > 0) {
        auditEvent.entity = entities;
      }

    }

	}
}

module.exports = Converter;
