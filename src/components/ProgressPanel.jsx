import { useEffect, useState } from 'react'
import { BarChart2 } from 'lucide-react'

export default function ProgressPanel({ userId }) {
  const [items, setItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/progress/${userId}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [userId])

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center gap-2 text-sky-700 mb-3">
        <BarChart2 className="w-5 h-5" />
        <h2 className="font-semibold">Progress</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No progress saved yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li key={idx} className="border rounded-md px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.topic} · {it.level}</div>
                {typeof it.score === 'number' && (
                  <div className="text-xs text-gray-600">Score: {Math.round(it.score*100)/100}</div>
                )}
              </div>
              {it.notes && <div className="text-xs text-gray-600 mt-1">{it.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
