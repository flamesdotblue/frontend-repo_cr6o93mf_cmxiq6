import { useState } from 'react'
import { ListChecks, PlayCircle, CreditCard } from 'lucide-react'

export default function Planner({ onStartCoaching }) {
  const [userQuery, setUserQuery] = useState('')
  const [subject, setSubject] = useState('general')
  const [level, setLevel] = useState('beginner')
  const [targetHours, setTargetHours] = useState(6)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const generatePlan = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/tutor/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: userQuery, subject, level, target_hours: Number(targetHours) })
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Failed to generate plan')
      }
      const data = await res.json()
      setPlan(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const startCheckout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/payments/create-checkout-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'pro' }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <ListChecks className="w-5 h-5" />
          <h2 className="font-semibold">Playlist Planner</h2>
        </div>
        <button onClick={startCheckout} className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
          <CreditCard className="w-4 h-4" /> Upgrade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="What do you want to learn? (e.g., Python for data analysis)"
          className="border rounded-md px-3 py-2 text-sm md:col-span-2"
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="general">General</option>
          <option value="programming">Programming</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <div className="md:col-span-3 flex items-center gap-3">
          <label className="text-xs text-gray-500">Target hours</label>
          <input type="number" min="1" step="0.5" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} className="border rounded-md px-3 py-2 text-sm w-28" />
          <button onClick={generatePlan} disabled={loading} className="ml-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg">
            {loading ? 'Generating…' : 'Generate plan'}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      {plan && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{plan.subject.toUpperCase()} • {plan.level.toUpperCase()} • ~{plan.total_hours} hrs</h3>
            <button onClick={() => onStartCoaching?.()} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
              <PlayCircle className="w-4 h-4" /> Start coaching
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {plan.modules.map((m, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-800">{m.title}</div>
                  <div className="text-xs text-gray-500">~{m.estimated_hours} hrs</div>
                </div>
                <ul className="mt-2 space-y-2">
                  {m.lessons.map((l, j) => (
                    <li key={j} className="text-sm flex items-center justify-between gap-3">
                      <div>
                        <span className="font-medium">{l.type.toUpperCase()}</span> — {l.title}
                        {l.url && (
                          <a href={l.url} target="_blank" rel="noreferrer" className="ml-2 text-indigo-600 hover:text-indigo-700 underline">Open</a>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{l.duration_hours}h</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
