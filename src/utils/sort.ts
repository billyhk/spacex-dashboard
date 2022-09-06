import { MappedPayload } from './getPayloadsByNationality'

export const sortByCount = (a: MappedPayload, b: MappedPayload) => {
  if (a.count > b.count) {
    return -1
  }
  if (a.count < b.count) {
    return 1
  }
  return 0
}
