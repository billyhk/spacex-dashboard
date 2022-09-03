import { Mission, Payload } from '../interfaces'
import { countFrequency, flattenStrArray } from '.'

export const getPayloadsByNationality = (missions: Mission[]) => {
  const nationalitiesArr = missions.map((mission) => {
    return mission.payloads
      .map((payload: Payload) => payload?.nationality)
      .filter((payload) => !!payload)
  })
  return countFrequency(flattenStrArray(nationalitiesArr))
}
