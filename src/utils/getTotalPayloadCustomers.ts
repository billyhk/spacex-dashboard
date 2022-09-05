import { Mission, Payload } from '../interfaces'
import { flattenStrArray } from './flattenStrArray'

export const getTotalPayloadCustomers = (filteredMissions: Mission[]) => {
  const payloadsPerMission = filteredMissions.map((mission: Mission) => {
    return mission.payloads.filter((payload: Payload) => !!payload)
  })
  const helperFlatten = (arr: any[]): Payload[] => {
    return arr.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? helperFlatten(val) : val),
      []
    ) as Payload[]
  }

  const flattenedPayloads = helperFlatten(payloadsPerMission)
  const customers = flattenedPayloads.map(
    (payload: Payload) => payload?.customers
  )

  const flattenedCustomers = flattenStrArray(customers)
  return flattenedCustomers.length
}
