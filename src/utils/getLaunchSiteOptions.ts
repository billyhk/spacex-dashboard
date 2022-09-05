import { DetailedLaunchRow } from '../interfaces'
import { findDuplicates } from './findDuplicates'

export const getLaunchSiteOptions = (
  paginatedLaunches: DetailedLaunchRow[]
) => {
  const paginatedLaunchSites = paginatedLaunches.map((launch) => launch.site)
  const deduplicated = new Set(findDuplicates(paginatedLaunchSites))
  return Array.from(deduplicated) as string[]
}
