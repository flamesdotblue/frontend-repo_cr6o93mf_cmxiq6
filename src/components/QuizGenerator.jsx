import { useState } from 'react'
import { ListChecks } from 'lucide-react'

export default function QuizGenerator() {
  const [topic, setTopic] = useState('fractions')
  const [level, setLevel] = useState('beginner')
  const [count, setCount] = useState(3)
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const generate = async () => {
    const res = await fetch(`${baseUrl}/api/tutor/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level, count })
    })
    const data = await res.json()
    setQuiz(data)
    setAnswers({})
  }

  const selectAnswer = (qi, oi) => {
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center gap-2 text-emerald-700 mb-3">
        <ListChecks className="w-5 h-5" />
        <h2 className="font-semibold">Quick Quiz</h2>
      </div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <input value={topic} onChange={(e)=>setTopic(e.target.value)} className="border rounded-md px-2 py-1 text-sm" placeholder="Topic" />
        <select value={level} onChange={(e)=>setLevel(e.target.value)} className="border rounded-md px-2 py-1 text-sm">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input type="number" min={1} max={10} value={count} onChange={(e)=>setCount(parseInt(e.target.value)||1)} className="border rounded-md px-2 py-1 text-sm w-20" />
        <button onClick={generate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm">Generate</button>
      </div>

      {quiz && (
        <div className="space-y-4">
          {quiz.questions.map((q, qi) => {
            const selected = answers[qi]
            const correct = selected !== undefined && selected === q.answer_index
            const wrong = selected !== undefined && selected !== q.answer_index
            return (
              <div key={qi} className={`border rounded-lg p-3 ${correct ? 'border-emerald-400 bg-emerald-50' : wrong ? 'border-rose-300 bg-rose-50' : 'border-gray-200'}`}>
                <div className="font-medium mb-2">Q{qi+1}. {q.question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => selectAnswer(qi, oi)}
                      className={`text-left border rounded-md px-3 py-2 text-sm ${selected===oi ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {String.fromCharCode(65+oi)}. {opt}
                    </button>
                  ))}
                </div>
                {selected !== undefined && (
                  <div className="mt-2 text-xs text-gray-600">
                    {correct ? 'Correct! ' : 'Not quite. '} {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
