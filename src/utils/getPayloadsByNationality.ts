import { MissionPayloads, Payload } from '../interfaces'
import { countFrequency } from '.'

export interface MappedPayload {
  country: string
  count: number
}

export const getPayloadsByNationality = (
  missionPayloads: MissionPayloads
): MappedPayload[] => {
  const nationalities = missionPayloads.map((payload: never[] | Payload) => {
    if (payload && 'nationality' in payload) {
      return payload.nationality
    }
    return ''
  })

  const frequencyMap: { [key: string]: number } = countFrequency(nationalities)

  return Object.entries(frequencyMap).map(([key, value]: [string, number]) => {
    return {
      country: key,
      count: value,
    }
  })
}
