import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import './Chat.css'

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: 'Привет! Я твой ИИ-помощник по инвестициям. Могу объяснить метрики портфеля, подсказать про диверсификацию или разобрать риск. Спрашивай что угодно — пока я работаю в демо-режиме, но скоро подключим полноценную нейросеть.'
  }
]

const QUICK_PROMPTS = [
  'Что такое коэффициент Шарпа?',
  'Как снизить риск портфеля?',
  'Объясни мою доходность',
]

export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text) => {
    const content = (text || input).trim()
    if (!content) return

    const userMsg = { id: Date.now(), role: 'user', text: content }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Заглушка для будущего ИИ
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Пока я не подключён к нейросети — скоро здесь будет полноценный ответ. Но уже вижу, что ты задал отличный вопрос! 🔥'
      }])
    }, 600)
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-icon"><Sparkles size={18} /></div>
        <div>
          <h1 className="chat-title">ИИ-помощник</h1>
          <p className="chat-subtitle">Демо-режим · нейросеть скоро</p>
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.map(m => (
          <div key={m.id} className={`chat-msg ${m.role}`}>
            <div className="chat-msg-avatar">
              {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="chat-msg-bubble">{m.text}</div>
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <div className="chat-suggestions">
          {QUICK_PROMPTS.map(q => (
            <button key={q} className="suggestion" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-wrap">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Спроси что-нибудь о портфеле..."
        />
        <button className="chat-send" onClick={() => sendMessage()} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}