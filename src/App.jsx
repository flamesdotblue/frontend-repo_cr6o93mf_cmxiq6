import { useEffect, useMemo, useState, useRef } from 'react'
import HeroSpline from './components/HeroSpline'
import AuthPanel from './components/AuthPanel'
import Planner from './components/Planner'
import ChatTutor from './components/ChatTutor'

function App() {
  const [subject, setSubject] = useState('general')
  const [userId, setUserId] = useState('')
  const chatRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('tutor_user_id')
    if (saved) {
      setUserId(saved)
    } else {
      const id = 'u_' + Math.random().toString(36).slice(2, 10)
      localStorage.setItem('tutor_user_id', id)
      setUserId(id)
    }
  }, [])

  const gradient = useMemo(() => (
    'bg-gradient-to-br from-indigo-50 via-rose-50 to-emerald-50'
  ), [])

  const startCoaching = () => {
    // Scroll to chat
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen ${gradient}`}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <HeroSpline />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AuthPanel onAuth={({ name }) => name && localStorage.setItem('tutor_name', name)} />
            <div ref={chatRef}>
              <ChatTutor userId={userId} subject={subject} />
            </div>
          </div>
          <div className="space-y-6">
            <Planner onStartCoaching={startCoaching} />
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="text-sm text-gray-700">Subject focus</div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 border rounded-md px-2 py-2 text-sm w-full"
              >
                <option value="general">General</option>
                <option value="programming">Programming</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 pt-4 pb-8">Built with ❤️ for better learning</footer>
      </div>
    </div>
  )
}

export default App
