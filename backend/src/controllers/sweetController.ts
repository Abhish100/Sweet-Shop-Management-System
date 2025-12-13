import { Request, Response } from 'express'
import * as sweetService from '../services/sweetService'

export async function addSweet(req: Request, res: Response) {
  try {
    const s = await sweetService.addSweet(req.body)
    res.status(201).json(s)
  } catch (err: any) { res.status(400).json({ error: err.message }) }
}
export async function listSweets(_req: Request, res: Response) {
  const s = await sweetService.listSweets()
  res.json(s)
}
export async function searchSweets(req: Request, res: Response) {
  const s = await sweetService.searchSweets(req.query)
  res.json(s)
}
export async function updateSweet(req: Request, res: Response) {
  try { const s = await sweetService.updateSweet(req.params.id, req.body); res.json(s) } catch (err: any) { res.status(400).json({ error: err.message }) }
}
export async function deleteSweet(req: Request, res: Response) {
  try { const s = await sweetService.deleteSweet(req.params.id); res.json(s) } catch (err: any) { res.status(400).json({ error: err.message }) }
}
export async function purchaseSweet(req: Request, res: Response) {
  try { const s = await sweetService.purchase(req.params.id); res.json(s) } catch (err: any) { res.status(400).json({ error: err.message }) }
}
export async function restockSweet(req: Request, res: Response) {
  try { const s = await sweetService.restock(req.params.id, Number(req.body.amount || 0)); res.json(s) } catch (err: any) { res.status(400).json({ error: err.message }) }
}
