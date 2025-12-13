import api from './api'

export type Sweet = {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  image?: string
}

export async function fetchSweets() {
  const res = await api.get('/sweets')
  return res.data as Sweet[]
}

export async function purchaseSweet(id: string) {
  const res = await api.post(`/sweets/${id}/purchase`)
  return res.data as Sweet
}

export async function createSweet(sweet: Partial<Sweet>) {
  const res = await api.post('/sweets', sweet)
  return res.data as Sweet
}

export async function updateSweet(id: string, sweet: Partial<Sweet>) {
  const res = await api.put(`/sweets/${id}`, sweet)
  return res.data as Sweet
}

export async function deleteSweet(id: string) {
  const res = await api.delete(`/sweets/${id}`)
  return res.data
}
