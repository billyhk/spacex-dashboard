import { Mission, Payload } from '../interfaces'
import { flattenIntArray } from '.'

export const countPayloads = (missions: Mission[]) => {
  const payloadsPerMission = missions.map((mission: Mission) => {
    return mission.payloads
      .map((payload: Payload) => payload?.payload_mass_kg || 0)
      .filter((mass: number) => !!mass)
  })
  return flattenIntArray(payloadsPerMission).length
}
