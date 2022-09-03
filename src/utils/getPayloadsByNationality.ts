import { Mission, Payload } from '../interfaces'
import { countFrequency, flattenStrArray } from '.'

export interface MappedPayload {
  country: string
  count: number
}

export const getPayloadsByNationality = (
  missions: Mission[]
): MappedPayload[] => {
  const nationalitiesArr = missions.map((mission) => {
    return mission.payloads
      .map((payload: Payload) => payload?.nationality)
      .filter((payload) => !!payload)
  })
  const frequencyMap: { [key: string]: number } = countFrequency(
    flattenStrArray(nationalitiesArr)
  )

  return Object.entries(frequencyMap).map(([key, value]: [string, number]) => {
    return {
      country: key,
      count: value,
    }
  })
}
