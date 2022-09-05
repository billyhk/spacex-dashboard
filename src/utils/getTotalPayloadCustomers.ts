import { MissionPayloads, Payload } from '../interfaces'

export const getTotalPayloadCustomers = (missionPayloads: MissionPayloads) => {
  const customers = missionPayloads.map((payload: never[] | Payload) => {
    if (payload && 'customers' in payload) {
      return payload.customers
    }
    return ['']
  }).flat()

  return customers.length
}
