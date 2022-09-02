export interface LaunchSite {
  site_id: string
  site_name: string
}

export interface Launch {
  mission_id: string[]
  launch_site: LaunchSite
}

export interface Rocket {
  rocket_name: string
}

export interface DetailedLaunch {
  mission_name: string
  mission_id: string[]
  launch_date_utc: string
  rocket: Rocket
  launch_site: LaunchSite
  launch_success: boolean
}
