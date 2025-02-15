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
  data: Mission[]
  meta: {
    totalRowCount: number
  }
}

export type MissionPayloads = (Payload | never[])[]
