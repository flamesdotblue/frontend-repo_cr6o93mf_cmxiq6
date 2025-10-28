import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

export default function ChatTutor({ userId, subject }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your personal tutor. What would you like to learn today?' }
  ])
  const [input, setInput] = useState('')
  const [level, setLevel] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${baseUrl}/api/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          subject,
          message: text,
          level,
          history: next.map(m => ({ role: m.role, content: m.content, subject }))
        })
      })
      const data = await res.json()
      const addon = `\n\nKey points:\n- ${data.key_points?.join('\n- ') || ''}\n\n${data.follow_up_question || ''}`
      setMessages(prev => [...prev, { role: 'assistant', content: `${data.reply}${addon}` }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not reach the server.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4 flex flex-col h-[28rem]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold">Tutor Chat</h2>
        </div>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'ml-auto bg-indigo-50' : 'bg-gray-50'} rounded-lg px-3 py-2 text-sm`}>{m.content}</div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Ask about ${subject}...`}
          rows={2}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </section>
  )
}
