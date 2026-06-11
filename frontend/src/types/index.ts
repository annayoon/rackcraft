export interface BomItem {
  id: string
  category: string
  name: string
  model: string
  quantity: number
  unitPower?: number  // W
  unitHeight?: number // U
}

export interface Rack {
  id: string
  name: string
  type: 'b300' | 'rtx' | 'mgmt' | 'network'
  totalU: number
  items: RackItem[]
}

export interface RackItem {
  bomItemId: string
  name: string
  startU: number
  heightU: number
  power: number
}

export interface PowerConfig {
  totalPower: number   // kW
  redundancy: 'N' | 'N+1' | '2N'
  coolingType: 'air' | 'liquid' | 'hybrid'
  pue: number
}

export interface Project {
  id: string
  name: string
  bom: BomItem[]
  racks: Rack[]
  powerConfig: PowerConfig
  createdAt: string
}
