import { SortingState, ColumnSort } from '@tanstack/react-table'
import {
  DetailedLaunchApiResponse,
  DetailedLaunchRow,
  Mission,
  MissionApiResponse,
} from '../../interfaces'

// These will act as our databases
import detailedLaunches from '../../datasets/detailedLaunches.json'
import missions from '../../datasets/missions.json'

/**
 *
 * @param {number} start
 * @param {number} size
 * @param {SortingState} sorting
 * @returns {DetailedLaunchApiResponse}
 * Simulate an API call to fetch Detailed Launches. This function maps over response data to sanitize the data for the table.
 */
export const fetchLaunches = (
  start: number,
  size: number,
  sorting: SortingState
): DetailedLaunchApiResponse => {
  const mappedLaunches: DetailedLaunchRow[] =
    detailedLaunches.data.launches.map((launch) => {
      return {
        mission_name: launch.mission_name || '',
        date: launch.launch_date_utc || '',
        outcome: !!launch.launch_success ? 'Success' : 'Failure',
        rocket: launch.rocket.rocket_name || '',
        site: launch.launch_site.site_name || '',
        mission_id: launch.mission_id[0] || 'Not Available',
      }
    })

  const dbData = [...mappedLaunches]
  if (sorting.length) {
    const sort = sorting[0] as ColumnSort
    const { id, desc } = sort as {
      id: keyof DetailedLaunchRow
      desc: boolean
    }
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1
      }
      return a[id] > b[id] ? 1 : -1
    })
  }

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  }
}

/**
 *
 * @param {number} start
 * @param {number} size
 * @param {SortingState} sorting
 * @returns {MissionApiResponse}
 * Simulate an API call to fetch Missions.
 */
export const fetchMissions = (
  start: number,
  size: number,
  sorting: SortingState
): MissionApiResponse => {
  const dbData = [...missions.data.missions]
  if (sorting.length) {
    const sort = sorting[0] as ColumnSort
    const { id, desc } = sort as {
      id: keyof Mission
      desc: boolean
    }
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1
      }
      return a[id] > b[id] ? 1 : -1
    })
  }
  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  }
}
