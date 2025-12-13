import React, { useEffect, useState } from 'react'
import { fetchSweets, Sweet as SweetType, createSweet, updateSweet, deleteSweet } from '../services/sweets'

function ConfirmButton({ onConfirm, label = 'Delete' }: { onConfirm: () => Promise<void>, label?: string }) {
  const [confirm, setConfirm] = useState(false)
  return (
    <button onClick={async () => {
      if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 3000); return }
      await onConfirm()
    }} className="text-red-600">
      {confirm ? 'Confirm!' : label}
    </button>
  )
}

export default function AdminSweets() {
  const [sweets, setSweets] = useState<SweetType[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<SweetType | null>(null)
  const [form, setForm] = useState<Partial<SweetType>>({})

  useEffect(() => { setLoading(true); fetchSweets().then(d => setSweets(d)).finally(() => setLoading(false)) }, [])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.quantity) return
    if (editing) {
      const updated = await updateSweet(editing.id, form)
      setSweets(prev => prev.map(s => s.id === updated.id ? updated : s))
    } else {
      const created = await createSweet(form)
      setSweets(prev => [created, ...prev])
    }
    setForm({})
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    await deleteSweet(id)
    setSweets(prev => prev.filter(s => s.id !== id))
  }

  const startEdit = (s: SweetType) => {
    setEditing(s)
    setForm(s)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin - Sweets</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={form.name || ''} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="border rounded px-2 py-1" />
          <input value={form.category || ''} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="border rounded px-2 py-1" />
          <input value={(form.price !== undefined ? String(form.price) : '')} onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} placeholder="Price" className="border rounded px-2 py-1" />
          <input value={(form.quantity !== undefined ? String(form.quantity) : '')} onChange={e => setForm(prev => ({ ...prev, quantity: Number(e.target.value) }))} placeholder="Quantity" className="border rounded px-2 py-1" />
          <div className="col-span-2 flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setForm({}); setEditing(null) }} className="px-3 py-1 border rounded">Cancel</button>
          </div>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Array.isArray(sweets) ? sweets : []).map(s => (
          <div key={s.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-bold">{s.name}</div>
              <div className="text-sm text-gray-500">{s.category} • ${s.price.toFixed(2)} • Qty: {s.quantity}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(s)} className="text-blue-600">Edit</button>
              <ConfirmButton onConfirm={async () => handleDelete(s.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
