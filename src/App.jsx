import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ChatTutor from './components/ChatTutor'
import QuizGenerator from './components/QuizGenerator'
import ProgressPanel from './components/ProgressPanel'

function App() {
  const [subject, setSubject] = useState('general')
  const [userId, setUserId] = useState('')

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

  return (
    <div className={`min-h-screen ${gradient}`}>
      <Header subject={subject} setSubject={setSubject} userId={userId} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatTutor userId={userId} subject={subject} />
        </div>
        <div className="space-y-6">
          <QuizGenerator />
          <ProgressPanel userId={userId} />
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 pb-6">Built with ❤️ for better learning</footer>
    </div>
  )
}

export default App
