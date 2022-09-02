import { Mission, Payload } from '../interfaces'
import { flattenIntArray, getAverage } from '.'

export const getAvgPayloadMass = (missions: Mission[]): number => {
  const payloadsPerMission = missions.map((mission: Mission) => {
    return mission.payloads
      .map((payload: Payload) => payload?.payload_mass_kg || 0)
      .filter((mass: number) => !!mass)
  })

  return getAverage(flattenIntArray(payloadsPerMission))
}
