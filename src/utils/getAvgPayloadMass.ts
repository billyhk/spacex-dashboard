import { MissionPayloads, Payload } from '../interfaces'
import { getAverage } from '.'

export const getAvgPayloadMass = (missionPayloads: MissionPayloads): number => {
  const payloadMasses: number[] = missionPayloads.map(
    (payload: never[] | Payload) => {
      if (payload && 'payload_mass_kg' in payload) {
        return payload.payload_mass_kg || 0
      }
      return 0
    }
  )

  return getAverage(payloadMasses)
}
