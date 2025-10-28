import { useEffect, useState } from 'react'
import { Brain, User, BookOpen } from 'lucide-react'

export default function Header({ subject, setSubject, userId }) {
  const [name, setName] = useState('Learner')

  useEffect(() => {
    const saved = localStorage.getItem('tutor_name')
    if (saved) setName(saved)
  }, [])

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    localStorage.setItem('tutor_name', val)
  }

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700">
          <Brain className="w-6 h-6" />
          <span className="font-semibold">Personal Tutor</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="general">General</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="programming">Programming</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <input
              value={name}
              onChange={handleNameChange}
              className="border rounded-md px-2 py-1 text-sm w-32"
              placeholder="Your name"
            />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-2 text-xs text-gray-500">ID: {userId}</div>
    </header>
  )
}
