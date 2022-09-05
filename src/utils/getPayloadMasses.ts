import { MissionPayloads, Payload } from '../interfaces'

export const getPayloadMasses = (missionPayloads: MissionPayloads) => {
  const payloadMasses: number[] = missionPayloads.map(
    (payload: never[] | Payload) => {
      if (payload && 'payload_mass_kg' in payload) {
        return payload.payload_mass_kg || 0
      }
      return 0
    }
  )
  return payloadMasses
}
