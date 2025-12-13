import * as repo from '../repositories/sweetRepository'

export async function addSweet(data: { name: string, category: string, price: number, quantity: number }) {
  // simple validation
  if (!data.name) throw new Error('Name required')
  if (data.price < 0) throw new Error('Invalid price')
  return repo.createSweet(data)
}
export async function listSweets() {
  return repo.getSweets()
}
export async function searchSweets(q: any) {
  return repo.searchSweets(q)
}
export async function updateSweet(id: string, data: any) {
  return repo.updateSweet(id, data)
}
export async function deleteSweet(id: string) {
  return repo.deleteSweet(id)
}
export async function purchase(id: string) {
  const s = await repo.findSweetById(id)
  if (!s) throw new Error('Not found')
  if (s.quantity <= 0) throw new Error('Out of stock')
  return repo.updateSweet(id, { quantity: s.quantity - 1 })
}
export async function restock(id: string, amount: number) {
  const s = await repo.findSweetById(id)
  if (!s) throw new Error('Not found')
  return repo.updateSweet(id, { quantity: s.quantity + amount })
}
