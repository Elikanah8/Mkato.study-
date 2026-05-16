'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Star, Plus, Brain, ChevronLeft, ChevronRight, RotateCcw,
  Trash2, Edit3, Check, X, BookOpen, Zap, TrendingUp,
  Search, Upload, Award, Clock, LogOut, User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────
type Flashcard = {
  id: string
  front: string
  back: string
  subject: string
  known: boolean | null
}

type Deck = {
  id: string
  name: string
  subject: string
  cards: Flashcard[]
  color: string
}

// ─── Sidebar link (matches dashboard) ────────────────────────────────────────
function SidebarLink({ icon: Icon, label, active, href }: {
  icon: any; label: string; active?: boolean; href: string
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ x: 4, background: 'var(--teal-light)' }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 16px', borderRadius: '10px',
          background: active ? 'var(--teal-light)' : 'transparent',
          cursor: 'pointer', transition: 'background 0.2s', marginBottom: '4px',
        }}
      >
        <Icon size={18} color={active ? 'var(--teal)' : 'var(--text-mid)'} />
        <span style={{
          fontSize: '14px', fontWeight: active ? '600' : '500',
          color: active ? 'var(--teal)' : 'var(--text-mid)',
        }}>{label}</span>
        {active && (
          <div style={{
            marginLeft: 'auto', width: '6px', height: '6px',
            borderRadius: '50%', background: 'var(--teal)',
          }} />
        )}
      </motion.div>
    </Link>
  )
}

// ─── Deck card ────────────────────────────────────────────────────────────────
function DeckCard({ deck, onStudy, onDelete }: {
  deck: Deck; onStudy: () => void; onDelete: () => void
}) {
  const known = deck.cards.filter(c => c.known === true).length
  const progress = deck.cards.length > 0 ? Math.round((known / deck.cards.length) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(74,155,142,0.12)' }}
      style={{
        background: 'var(--off-white)', borderRadius: '16px',
        padding: '20px', border: '1px solid rgba(74,155,142,0.12)',
        transition: 'box-shadow 0.3s', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: deck.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Star size={20} color="var(--teal)" />
        </div>
        <motion.button
          whileHover={{ background: '#FCEBEB' }}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            width: '30px', height: '30px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Trash2 size={14} color="var(--text-light)" />
        </motion.button>
      </div>
      <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>{deck.name}</p>
      <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '14px' }}>{deck.subject} • {deck.cards.length} cards</p>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-mid)' }}>Progress</span>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--teal)' }}>{progress}%</span>
        </div>
        <div style={{ height: '5px', background: 'var(--eggshell)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%', background: 'var(--teal)', borderRadius: '3px' }}
          />
        </div>
      </div>
      <motion.button
        whileHover={{ background: 'var(--teal-dark)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onStudy}
        style={{
          width: '100%', padding: '10px', background: 'var(--teal)',
          border: 'none', borderRadius: '10px', color: 'white',
          fontWeight: '600', fontSize: '13px', cursor: 'pointer',
        }}
      >
        Study Now
      </motion.button>
    </motion.div>
  )
}

// ─── Flip card ────────────────────────────────────────────────────────────────
function FlipCard({ card, onKnow, onDontKnow }: {
  card: Flashcard; onKnow: () => void; onDontKnow: () => void
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => { setFlipped(false) }, [card.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Card */}
      <motion.div
        onClick={() => setFlipped(f => !f)}
        style={{
          width: '100%', maxWidth: '560px', height: '280px',
          cursor: 'pointer', perspective: '1000px',
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            background: 'var(--off-white)', borderRadius: '20px',
            border: '2px solid rgba(74,155,142,0.2)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '32px', boxShadow: '0 8px 32px rgba(74,155,142,0.1)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.08em', marginBottom: '16px' }}>QUESTION</span>
            <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)', textAlign: 'center', lineHeight: 1.5 }}>{card.front}</p>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '20px' }}>Tap to reveal answer</span>
          </div>
          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--teal-light)', borderRadius: '20px',
            border: '2px solid rgba(74,155,142,0.3)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '32px', boxShadow: '0 8px 32px rgba(74,155,142,0.15)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--teal)', letterSpacing: '0.08em', marginBottom: '16px' }}>ANSWER</span>
            <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-dark)', textAlign: 'center', lineHeight: 1.6 }}>{card.back}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Action buttons — only show when flipped */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ display: 'flex', gap: '16px' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDontKnow}
              style={{
                padding: '12px 28px', borderRadius: '12px',
                background: '#FCEBEB', border: '1px solid #F5C6C6',
                color: '#C0392B', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <X size={16} /> Still learning
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onKnow}
              style={{
                padding: '12px 28px', borderRadius: '12px',
                background: 'var(--teal)', border: 'none',
                color: 'white', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <Check size={16} /> Got it
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Study session modal ──────────────────────────────────────────────────────
function StudySession({ deck, onClose, onUpdate }: {
  deck: Deck; onClose: () => void; onUpdate: (cards: Flashcard[]) => void
}) {
  const [index, setIndex] = useState(0)
  const [cards, setCards] = useState<Flashcard[]>([...deck.cards])
  const [done, setDone] = useState(false)

  const card = cards[index]
  const known = cards.filter(c => c.known === true).length

  function handleKnow() {
    const updated = cards.map((c, i) => i === index ? { ...c, known: true } : c)
    setCards(updated)
    onUpdate(updated)
    advance(updated)
  }

  function handleDontKnow() {
    const updated = cards.map((c, i) => i === index ? { ...c, known: false } : c)
    setCards(updated)
    onUpdate(updated)
    advance(updated)
  }

  function advance(updated: Flashcard[]) {
    if (index + 1 >= updated.length) setDone(true)
    else setIndex(i => i + 1)
  }

  function restart() {
    const reset = cards.map(c => ({ ...c, known: null }))
    setCards(reset)
    onUpdate(reset)
    setIndex(0)
    setDone(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(44,44,44,0.5)',
        zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--eggshell)', borderRadius: '24px',
          padding: '32px', width: '100%', maxWidth: '640px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '2px' }}>{deck.name}</p>
            <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)' }}>
              {done ? 'Session complete!' : `Card ${index + 1} of ${cards.length}`}
            </p>
          </div>
          <motion.button
            whileHover={{ background: 'var(--eggshell)' }}
            onClick={onClose}
            style={{
              background: 'var(--off-white)', border: '1px solid rgba(74,155,142,0.15)',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} color="var(--text-mid)" />
          </motion.button>
        </div>

        {/* Progress bar */}
        <div style={{ height: '5px', background: 'var(--off-white)', borderRadius: '3px', overflow: 'hidden', marginBottom: '28px' }}>
          <motion.div
            animate={{ width: `${((index + (done ? 1 : 0)) / cards.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', background: 'var(--teal)', borderRadius: '3px' }}
          />
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
              {known === cards.length ? 'Perfect score!' : `${known} / ${cards.length} cards known`}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '28px' }}>
              {known === cards.length
                ? 'You know all the cards in this deck. Mkato!'
                : `Keep going — you're ${Math.round((known / cards.length) * 100)}% there.`}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={restart}
                style={{
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'var(--off-white)', border: '1px solid rgba(74,155,142,0.2)',
                  color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <RotateCcw size={15} /> Restart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'var(--teal)', border: 'none',
                  color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                }}
              >
                Done
              </motion.button>
            </div>
          </div>
        ) : (
          <FlipCard card={card} onKnow={handleKnow} onDontKnow={handleDontKnow} />
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Create deck modal ────────────────────────────────────────────────────────
function CreateDeckModal({ onClose, onCreate }: {
  onClose: () => void; onCreate: (deck: Deck) => void
}) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [cards, setCards] = useState([{ front: '', back: '' }])

  const COLORS = ['var(--teal-light)', 'var(--blue-light)', '#EAF3DE', '#FAEEDA', '#F3E8FF']

  function addCard() { setCards(c => [...c, { front: '', back: '' }]) }
  function removeCard(i: number) { setCards(c => c.filter((_, idx) => idx !== i)) }
  function updateCard(i: number, field: 'front' | 'back', val: string) {
    setCards(c => c.map((card, idx) => idx === i ? { ...card, [field]: val } : card))
  }

  function handleCreate() {
    if (!name.trim() || !subject.trim()) return
    const validCards = cards.filter(c => c.front.trim() && c.back.trim())
    if (validCards.length === 0) return
    const deck: Deck = {
      id: Date.now().toString(),
      name: name.trim(),
      subject: subject.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      cards: validCards.map((c, i) => ({
        id: `${Date.now()}-${i}`,
        front: c.front.trim(),
        back: c.back.trim(),
        subject: subject.trim(),
        known: null,
      })),
    }
    onCreate(deck)
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--eggshell)', border: '1px solid rgba(74,155,142,0.2)',
    borderRadius: '10px', fontSize: '14px', color: 'var(--text-dark)',
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(44,44,44,0.5)',
        zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 24px', overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--eggshell)', borderRadius: '24px',
          padding: '32px', width: '100%', maxWidth: '560px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-dark)' }}>Create Deck</h2>
          <motion.button
            whileHover={{ background: 'var(--eggshell)' }}
            onClick={onClose}
            style={{
              background: 'var(--off-white)', border: '1px solid rgba(74,155,142,0.15)',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} color="var(--text-mid)" />
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '6px' }}>Deck name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Organic Chemistry" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '6px' }}>Subject / Course</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. CHEM 201" style={inputStyle} />
          </div>
        </div>

        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '12px' }}>Cards</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto' }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              background: 'var(--off-white)', borderRadius: '12px',
              padding: '14px', border: '1px solid rgba(74,155,142,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-light)' }}>Card {i + 1}</span>
                {cards.length > 1 && (
                  <motion.button whileHover={{ color: '#C0392B' }} onClick={() => removeCard(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex' }}>
                    <Trash2 size={13} />
                  </motion.button>
                )}
              </div>
              <input value={card.front} onChange={e => updateCard(i, 'front', e.target.value)}
                placeholder="Question / term" style={{ ...inputStyle, marginBottom: '8px' }} />
              <textarea value={card.back} onChange={e => updateCard(i, 'back', e.target.value)}
                placeholder="Answer / definition" rows={2}
                style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ background: 'var(--teal-light)' }}
          onClick={addCard}
          style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: '1px dashed rgba(74,155,142,0.4)', borderRadius: '10px',
            color: 'var(--teal)', fontWeight: '600', fontSize: '13px',
            cursor: 'pointer', marginBottom: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <Plus size={15} /> Add card
        </motion.button>

        <motion.button
          whileHover={{ background: 'var(--teal-dark)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreate}
          style={{
            width: '100%', padding: '13px', background: 'var(--teal)',
            border: 'none', borderRadius: '12px', color: 'white',
            fontWeight: '700', fontSize: '15px', cursor: 'pointer',
          }}
        >
          Create Deck
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Sample decks ─────────────────────────────────────────────────────────────
const SAMPLE_DECKS: Deck[] = [
  {
    id: 'sample-1',
    name: 'Business Law Basics',
    subject: 'LAW 101',
    color: 'var(--teal-light)',
    cards: [
      { id: 's1-1', front: 'What is a contract?', back: 'A legally binding agreement between two or more parties that creates mutual obligations enforceable by law.', subject: 'LAW 101', known: null },
      { id: 's1-2', front: 'Define consideration in contract law', back: 'Something of value exchanged between parties — it can be money, services, goods, or a promise to act or refrain from acting.', subject: 'LAW 101', known: null },
      { id: 's1-3', front: 'What is an offer?', back: 'A clear proposal made by one party (offeror) to another (offeree) indicating willingness to enter into a contract on specific terms.', subject: 'LAW 101', known: null },
    ],
  },
  {
    id: 'sample-2',
    name: 'Macroeconomics Key Terms',
    subject: 'ECON 201',
    color: 'var(--blue-light)',
    cards: [
      { id: 's2-1', front: 'What is GDP?', back: 'Gross Domestic Product — the total monetary value of all goods and services produced within a country in a specific time period.', subject: 'ECON 201', known: null },
      { id: 's2-2', front: 'Define inflation', back: 'A sustained increase in the general price level of goods and services in an economy over time, reducing purchasing power.', subject: 'ECON 201', known: null },
      { id: 's2-3', front: 'What is fiscal policy?', back: 'Government use of taxation and spending to influence the economy — expansionary policy increases spending, contractionary reduces it.', subject: 'ECON 201', known: null },
      { id: 's2-4', front: 'Define opportunity cost', back: 'The value of the next best alternative foregone when making a decision — the hidden cost of every choice.', subject: 'ECON 201', known: null },
    ],
  },
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FlashcardsPage() {
  const [user, setUser] = useState<{ email: string; full_name?: string; avatar_url?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [decks, setDecks] = useState<Deck[]>(SAMPLE_DECKS)
  const [studyDeck, setStudyDeck] = useState<Deck | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        })
      } else {
        window.location.href = '/login'
      }
      setLoading(false)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function handleCreate(deck: Deck) {
    setDecks(d => [deck, ...d])
  }

  function handleDelete(id: string) {
    setDecks(d => d.filter(deck => deck.id !== id))
  }

  function handleUpdateCards(deckId: string, cards: Flashcard[]) {
    setDecks(d => d.map(deck => deck.id === deckId ? { ...deck, cards } : deck))
    if (studyDeck?.id === deckId) setStudyDeck(prev => prev ? { ...prev, cards } : prev)
  }

  const filtered = decks.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.subject.toLowerCase().includes(search.toLowerCase())
  )

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)
  const totalKnown = decks.reduce((sum, d) => sum + d.cards.filter(c => c.known === true).length, 0)
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--eggshell)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '40px', height: '40px', border: '3px solid rgba(74,155,142,0.2)', borderTop: '3px solid var(--teal)', borderRadius: '50%' }}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--eggshell)' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '240px', minHeight: '100vh', background: 'var(--off-white)',
          borderRight: '1px solid rgba(74,155,142,0.12)', padding: '24px 16px',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={32} height={32} />
          <span style={{ fontWeight: '800', fontSize: '17px', color: 'var(--teal)' }}>
            mkato<span style={{ color: 'var(--blue)' }}>.study</span>
          </span>
        </Link>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '16px' }}>MAIN</p>
          <SidebarLink icon={TrendingUp} label="Dashboard" href="/dashboard" />
          <SidebarLink icon={Search} label="Find Papers" href="/papers" />
          <SidebarLink icon={Brain} label="Mkato AI" href="/ai" />
          <SidebarLink icon={Upload} label="Upload Paper" href="/upload" />
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.08em', margin: '20px 0 8px', paddingLeft: '16px' }}>STUDY TOOLS</p>
          <SidebarLink icon={Star} label="Flashcards" active href="/flashcards" />
          <SidebarLink icon={Award} label="Pass Predictor" href="/predictor" />
          <SidebarLink icon={Clock} label="Study Planner" href="/planner" />
          <SidebarLink icon={BookOpen} label="My Notes" href="/notes" />
        </div>

        <div style={{ borderTop: '1px solid rgba(74,155,142,0.12)', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', marginBottom: '8px' }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{firstName[0]?.toUpperCase()}</span>
              </div>
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>Free plan</p>
            </div>
          </div>
          <motion.button
            whileHover={{ background: '#FCEBEB', color: '#791F1F' }}
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 16px', background: 'transparent',
              border: '1px solid rgba(74,155,142,0.15)', borderRadius: '10px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', fontWeight: '500', color: 'var(--text-mid)', transition: 'all 0.2s',
            }}
          >
            <LogOut size={15} /> Sign out
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', maxWidth: 'calc(100vw - 240px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}
        >
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>Study Tools</p>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-dark)' }}>Flashcards</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/upgrade" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'var(--teal)', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Zap size={14} color="white" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>Upgrade — Ksh 199</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total decks', value: decks.length.toString(), color: 'var(--teal-light)', icon: Star },
            { label: 'Total cards', value: totalCards.toString(), color: 'var(--blue-light)', icon: BookOpen },
            { label: 'Cards known', value: totalKnown.toString(), color: '#EAF3DE', icon: Check },
            { label: 'Mastery', value: totalCards > 0 ? `${Math.round((totalKnown / totalCards) * 100)}%` : '0%', color: '#FAEEDA', icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(74,155,142,0.12)' }}
              style={{ background: 'var(--off-white)', borderRadius: '16px', padding: '20px 24px', border: '1px solid rgba(74,155,142,0.12)' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <stat.icon size={20} color="var(--teal)" />
              </div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-mid)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + create row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search decks..."
              style={{
                width: '100%', padding: '11px 14px 11px 40px',
                background: 'var(--off-white)', border: '1px solid rgba(74,155,142,0.2)',
                borderRadius: '12px', fontSize: '14px', color: 'var(--text-dark)',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03, background: 'var(--teal-dark)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            style={{
              padding: '11px 20px', background: 'var(--teal)', border: 'none',
              borderRadius: '12px', color: 'white', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <Plus size={16} /> New Deck
          </motion.button>
        </div>

        {/* Decks grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '64px 24px',
              background: 'var(--off-white)', borderRadius: '20px',
              border: '1px dashed rgba(74,155,142,0.25)',
            }}
          >
            <Star size={48} color="rgba(74,155,142,0.3)" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-mid)', marginBottom: '8px' }}>
              {search ? 'No decks match your search' : 'No flashcard decks yet'}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Create your first deck to start studying smarter'}
            </p>
            {!search && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreate(true)}
                style={{
                  padding: '12px 24px', background: 'var(--teal)', border: 'none',
                  borderRadius: '12px', color: 'white', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                <Plus size={16} /> Create First Deck
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map(deck => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onStudy={() => setStudyDeck(deck)}
                onDelete={() => handleDelete(deck.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {studyDeck && (
          <StudySession
            deck={studyDeck}
            onClose={() => setStudyDeck(null)}
            onUpdate={(cards) => handleUpdateCards(studyDeck.id, cards)}
          />
        )}
        {showCreate && (
          <CreateDeckModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  )
}
