'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  Send, BookOpen, FileText, X, ChevronDown,
  RotateCcw, Copy, Check, ChevronLeft
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Mode = 'tutor' | 'explain' | 'notes' | 'exam'

type Paper = {
  id: string
  title: string
  university: string
  course: string
  year: string
}

// ─── Sample papers for attachment ────────────────────────────────────────────
const PAPERS: Paper[] = [
  { id: '1', title: 'Introduction to Economics',  university: 'University of Nairobi', course: 'BCOM 201', year: '2023' },
  { id: '2', title: 'Financial Accounting',        university: 'University of Nairobi', course: 'BCOM 202', year: '2023' },
  { id: '3', title: 'Calculus I',                  university: 'Kenyatta University',   course: 'MATH 101', year: '2023' },
  { id: '4', title: 'Engineering Mathematics',     university: 'JKUAT',                 course: 'MATH 112', year: '2023' },
  { id: '5', title: 'Computer Networks',           university: 'KCA University',        course: 'CSC 301',  year: '2023' },
  { id: '6', title: 'Microeconomics',              university: 'Kenyatta University',   course: 'ECON 201', year: '2021' },
  { id: '7', title: 'Database Systems',            university: 'JKUAT',                 course: 'CSC 212',  year: '2023' },
  { id: '8', title: 'Nursing Ethics',              university: 'University of Nairobi', course: 'NUR 301',  year: '2023' },
]

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: 'tutor',   label: 'Tutor',   description: 'Back-and-forth conversation about any topic' },
  { id: 'explain', label: 'Explain', description: 'Step-by-step breakdown of concepts' },
  { id: 'notes',   label: 'Notes',   description: 'Generate clean structured notes' },
  { id: 'exam',    label: 'Exam',    description: 'Practice questions with model answers' },
]

const NAV = [
  { label: 'Dashboard',      href: '/dashboard' },
  { label: 'Find Papers',    href: '/papers' },
  { label: 'Mkato AI',       href: '/ai', active: true },
  { label: 'Upload Paper',   href: '/upload' },
  { label: 'Flashcards',     href: '/flashcards' },
  { label: 'Pass Predictor', href: '/predictor' },
  { label: 'Study Planner',  href: '/planner' },
  { label: 'My Notes',       href: '/notes' },
]

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  function handleCopy() {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '10px',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--blue)' : 'var(--teal)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser ? (
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>U</span>
        ) : (
          <Image src="/mkato_study_logo.svg" alt="Mkato AI" width={18} height={18} />
        )}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '72%', position: 'relative' }}>
        <div style={{
          background: isUser ? 'var(--teal)' : 'var(--off-white)',
          borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
          padding: '12px 16px',
          border: isUser ? 'none' : '1px solid rgba(74,155,142,0.12)',
        }}>
          <p style={{
            fontSize: '14px', lineHeight: 1.65,
            color: isUser ? 'white' : 'var(--text-dark)',
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {message.content}
          </p>
        </div>

        {/* Copy button — only on AI messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute', top: '8px', right: '-30px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', opacity: 0.5,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.5'}
          >
            {copied
              ? <Check size={13} color="var(--teal)" />
              : <Copy size={13} color="var(--text-mid)" />
            }
          </button>
        )}

        <p style={{
          fontSize: '11px', color: 'var(--text-light)',
          marginTop: '5px', textAlign: isUser ? 'right' : 'left',
        }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'var(--teal)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Image src="/mkato_study_logo.svg" alt="Mkato AI" width={18} height={18} />
      </div>
      <div style={{
        background: 'var(--off-white)', borderRadius: '4px 14px 14px 14px',
        padding: '14px 18px', border: '1px solid rgba(74,155,142,0.12)',
        display: 'flex', gap: '5px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--teal)', opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AIPage() {
  const [messages, setMessages]         = useState<Message[]>([])
  const [input, setInput]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [mode, setMode]                 = useState<Mode>('tutor')
  const [attachedPaper, setAttachedPaper] = useState<Paper | null>(null)
  const [showPaperPicker, setShowPaperPicker] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [queriesUsed, setQueriesUsed]   = useState(0)
  const FREE_LIMIT = 5

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 140)}px`
    }
  }, [input])

  async function sendMessage() {
    if (!input.trim() || loading) return
    if (queriesUsed >= FREE_LIMIT) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setQueriesUsed(prev => prev + 1)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          paperContext: attachedPaper
            ? `${attachedPaper.title} — ${attachedPaper.course} — ${attachedPaper.university} (${attachedPaper.year})`
            : null,
        }),
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([])
    setQueriesUsed(0)
  }

  const currentMode = MODES.find(m => m.id === mode)!
  const remainingQueries = FREE_LIMIT - queriesUsed
  const isLimited = queriesUsed >= FREE_LIMIT

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--eggshell)' }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px', minHeight: '100vh',
        background: 'var(--off-white)',
        borderRight: '1px solid rgba(74,155,142,0.1)',
        padding: '24px 14px',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50, display: 'flex', flexDirection: 'column',
      }}>
        <Link href="/" style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center',
          gap: '10px', marginBottom: '36px', padding: '0 6px',
        }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={30} height={30} />
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--teal)' }}>
            mkato<span style={{ color: 'var(--blue)' }}>.study</span>
          </span>
        </Link>

        <nav style={{ flex: 1 }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '10px 12px', borderRadius: '9px', marginBottom: '2px',
                  background: item.active ? 'var(--teal-light)' : 'transparent',
                  transition: 'background 0.15s', cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!item.active)(e.currentTarget as HTMLDivElement).style.background = 'var(--eggshell)'
                }}
                onMouseLeave={e => {
                  if (!item.active)(e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: item.active ? '600' : '400',
                  color: item.active ? 'var(--teal)' : 'var(--text-mid)',
                }}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Query counter */}
        <div style={{
          borderTop: '1px solid rgba(74,155,142,0.1)',
          paddingTop: '16px', marginTop: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-mid)', fontWeight: '500' }}>
              AI queries today
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: isLimited ? '#C87A00' : 'var(--teal)' }}>
              {queriesUsed} / {FREE_LIMIT}
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--eggshell)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${(queriesUsed / FREE_LIMIT) * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: '100%', borderRadius: '2px',
                background: isLimited ? '#C87A00' : 'var(--teal)',
              }}
            />
          </div>
          {isLimited && (
            <p style={{ fontSize: '11px', color: '#C87A00', marginTop: '6px', lineHeight: 1.4 }}>
              Daily limit reached. Upgrade for unlimited queries.
            </p>
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <main style={{
        marginLeft: '220px', flex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>

        {/* Top bar */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--off-white)',
          borderBottom: '1px solid rgba(74,155,142,0.1)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/dashboard" style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center',
              gap: '4px', fontSize: '13px', color: 'var(--text-light)',
            }}>
              <ChevronLeft size={14} />
            </Link>

            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
                Mkato AI
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                {attachedPaper ? `Discussing: ${attachedPaper.title}` : 'General study assistant'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mode selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowModeMenu(!showModeMenu)}
                style={{
                  padding: '7px 12px',
                  background: 'var(--teal-light)',
                  border: '1px solid rgba(74,155,142,0.2)',
                  borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '600', color: 'var(--teal)',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                {currentMode.label}
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {showModeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0,
                      marginTop: '6px', background: 'var(--off-white)',
                      border: '1px solid rgba(74,155,142,0.15)',
                      borderRadius: '12px', padding: '6px',
                      width: '240px', zIndex: 100,
                      boxShadow: '0 8px 24px rgba(44,44,44,0.1)',
                    }}
                  >
                    {MODES.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setMode(m.id); setShowModeMenu(false) }}
                        style={{
                          width: '100%', padding: '10px 12px',
                          background: mode === m.id ? 'var(--teal-light)' : 'transparent',
                          border: 'none', borderRadius: '8px',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (mode !== m.id)(e.currentTarget as HTMLButtonElement).style.background = 'var(--eggshell)'
                        }}
                        onMouseLeave={e => {
                          if (mode !== m.id)(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                        }}
                      >
                        <p style={{ fontSize: '13px', fontWeight: '600', color: mode === m.id ? 'var(--teal)' : 'var(--text-dark)', margin: '0 0 2px' }}>
                          {m.label}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: 0 }}>
                          {m.description}
                        </p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear chat */}
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                style={{
                  padding: '7px 10px', background: 'transparent',
                  border: '1px solid rgba(74,155,142,0.18)',
                  borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', color: 'var(--text-mid)', fontWeight: '500',
                }}
              >
                <RotateCcw size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '28px 32px',
        }}>
          {messages.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'var(--teal-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Image src="/mkato_study_logo.svg" alt="Mkato AI" width={30} height={30} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
                Mkato AI
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                Ask anything about your studies. Attach a past paper for context-specific help.
              </p>

              {/* Starter prompts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '560px', margin: '0 auto' }}>
                {[
                  'Explain the concept of opportunity cost',
                  'Generate practice questions on calculus',
                  'Summarize the key principles of business law',
                  'How do I answer a 20-mark essay question?',
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    style={{
                      padding: '9px 16px',
                      background: 'var(--off-white)',
                      border: '1px solid rgba(74,155,142,0.18)',
                      borderRadius: '100px', cursor: 'pointer',
                      fontSize: '13px', color: 'var(--text-mid)', fontWeight: '500',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.borderColor = 'var(--teal)'
                      b.style.color = 'var(--teal)'
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.borderColor = 'rgba(74,155,142,0.18)'
                      b.style.color = 'var(--text-mid)'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--off-white)',
          borderTop: '1px solid rgba(74,155,142,0.1)',
          flexShrink: 0,
        }}>
          {/* Attached paper chip */}
          <AnimatePresence>
            {attachedPaper && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: '10px' }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--teal-light)',
                  border: '1px solid rgba(74,155,142,0.2)',
                  borderRadius: '8px', padding: '6px 12px',
                }}>
                  <FileText size={13} color="var(--teal)" />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--teal)' }}>
                    {attachedPaper.title} — {attachedPaper.course}
                  </span>
                  <button
                    onClick={() => setAttachedPaper(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={13} color="var(--teal)" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLimited ? (
            /* Upgrade prompt */
            <div style={{
              textAlign: 'center', padding: '16px',
              background: '#FFF4E6', borderRadius: '12px',
              border: '1px solid rgba(200,122,0,0.2)',
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#C87A00', marginBottom: '4px' }}>
                Daily limit reached
              </p>
              <p style={{ fontSize: '13px', color: '#956200', marginBottom: '12px' }}>
                Upgrade to Student Plan for unlimited Mkato AI queries.
              </p>
              <button style={{
                background: 'var(--teal)', color: 'white',
                border: 'none', borderRadius: '8px',
                padding: '9px 20px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer',
              }}>
                Upgrade — Ksh 199/mo
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-end',
              background: 'var(--eggshell)',
              border: '1.5px solid rgba(74,155,142,0.18)',
              borderRadius: '14px', padding: '10px 12px',
              transition: 'border-color 0.15s',
            }}
              onFocus={() => {}}
            >
              {/* Attach paper button */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setShowPaperPicker(!showPaperPicker)}
                  title="Attach a past paper"
                  style={{
                    width: '34px', height: '34px',
                    background: attachedPaper ? 'var(--teal-light)' : 'transparent',
                    border: '1px solid rgba(74,155,142,0.2)',
                    borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <BookOpen size={15} color={attachedPaper ? 'var(--teal)' : 'var(--text-light)'} />
                </button>

                {/* Paper picker dropdown */}
                <AnimatePresence>
                  {showPaperPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', bottom: '100%', left: 0,
                        marginBottom: '8px', background: 'var(--off-white)',
                        border: '1px solid rgba(74,155,142,0.15)',
                        borderRadius: '12px', padding: '6px',
                        width: '300px', zIndex: 100,
                        boxShadow: '0 8px 24px rgba(44,44,44,0.1)',
                        maxHeight: '280px', overflowY: 'auto',
                      }}
                    >
                      <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', padding: '6px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Attach a paper
                      </p>
                      {PAPERS.map(paper => (
                        <button
                          key={paper.id}
                          onClick={() => {
                            setAttachedPaper(paper)
                            setShowPaperPicker(false)
                          }}
                          style={{
                            width: '100%', padding: '10px 10px',
                            background: attachedPaper?.id === paper.id ? 'var(--teal-light)' : 'transparent',
                            border: 'none', borderRadius: '8px',
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => {
                            if (attachedPaper?.id !== paper.id)
                              (e.currentTarget as HTMLButtonElement).style.background = 'var(--eggshell)'
                          }}
                          onMouseLeave={e => {
                            if (attachedPaper?.id !== paper.id)
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                          }}
                        >
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', margin: '0 0 2px' }}>
                            {paper.title}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: 0 }}>
                            {paper.course} — {paper.university} — {paper.year}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Text input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={attachedPaper ? `Ask about ${attachedPaper.title}...` : 'Ask anything about your studies...'}
                rows={1}
                style={{
                  flex: 1, background: 'none', border: 'none',
                  outline: 'none', resize: 'none',
                  fontSize: '14px', color: 'var(--text-dark)',
                  lineHeight: 1.5, padding: '6px 0',
                  fontFamily: 'inherit', minHeight: '34px',
                }}
              />

              {/* Send button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: '36px', height: '36px', borderRadius: '9px',
                  background: input.trim() && !loading ? 'var(--teal)' : 'rgba(74,155,142,0.2)',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.15s',
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '14px', height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white', borderRadius: '50%',
                    }}
                  />
                ) : (
                  <Send size={15} color={input.trim() ? 'white' : 'rgba(74,155,142,0.5)'} />
                )}
              </motion.button>
            </div>
          )}

          <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>
            Press Enter to send — Shift+Enter for new line — {remainingQueries} {remainingQueries === 1 ? 'query' : 'queries'} remaining today
          </p>
        </div>
      </main>
    </div>
  )
}
