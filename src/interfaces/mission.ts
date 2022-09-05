export type Payload = {
  id: string
  payload_mass_kg: number | null
  nationality: string
  customers: string[]
} | null

export interface Mission {
  id: string
  name: string
  payloads: Payload[]
}

export interface MissionApiResponse {
  data: {
    missions: Mission[]
  }
}
