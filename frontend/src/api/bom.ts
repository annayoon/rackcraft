import axios from 'axios'

const api = axios.create({ baseURL: '' })

export interface BomItem {
  id: string
  category: string
  subcategory: string
  equipment: string
  quantity: number
  description: string
  unit_power_w: number | null
  unit_height_u: number | null
}

export interface BomImportResult {
  items: BomItem[]
  source: string
  warnings: string[]
}

export const importBom = async (file: File): Promise<BomImportResult> => {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post<BomImportResult>('/api/bom/import', form)
  return res.data
}

export const getSampleBom = async (): Promise<BomImportResult> => {
  const res = await api.get<BomImportResult>('/api/bom/sample')
  return res.data
}
