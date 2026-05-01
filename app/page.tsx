'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BookOpen, Brain, Zap, Users, ArrowRight, Star, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Animated typing text
const typingPhrases = [
  "Never fail an exam again.",
  "Find any past paper instantly.",
  "Let AI explain every answer.",
  "Study smarter, not harder.",
  "Your shortcut to passing.",
]

function TypingText() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = typingPhrases[index]
    let timeout

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex((index + 1) % typingPhrases.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, index])

  return (
    <span style={{ color: 'var(--teal)', borderRight: '3px solid var(--teal)', paddingRight: '4px' }}>
      {displayed}
    </span>
  )
}

// Floating blob background
function Blobs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,155,142,0.12) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', top: '200px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,127,166,0.1) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        style={{
          position: 'absolute', bottom: '-50px', left: '30%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,158,122,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Feature card
function FeatureCard({ icon: Icon, title, desc, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(74,155,142,0.15)' }}
      style={{
        background: 'var(--off-white)',
        borderRadius: '16px',
        padding: '28px 24px',
        border: '1px solid rgba(74,155,142,0.15)',
        cursor: 'default',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: color || 'var(--teal-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <Icon size={24} color="var(--teal)" />
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: '1.6' }}>{desc}</p>
    </motion.div>
  )
}

// Stat counter
function StatItem({ number, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ textAlign: 'center' }}
    >
      <p style={{ fontSize: '42px', fontWeight: '800', color: 'var(--teal)', lineHeight: 1 }}>{number}</p>
      <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginTop: '6px' }}>{label}</p>
    </motion.div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main style={{ background: 'var(--eggshell)', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(244,241,232,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(74,155,142,0.15)',
          padding: '0 24px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <motion.div whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study logo" width={36} height={36} />
          <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--teal)' }}>
            mkato<span style={{ color: 'var(--blue)' }}>.study</span>
          </span>
        </motion.div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          {['Features', 'How it works', 'Pricing'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              whileHover={{ color: 'var(--teal)' }}
              style={{ fontSize: '14px', color: 'var(--text-mid)', textDecoration: 'none', fontWeight: '500' }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, background: 'var(--teal-dark)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'var(--teal)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
          }}
        >
          Get Started Free
        </motion.button>
      </motion.nav>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px',
        overflow: 'hidden',
      }}>
        <Blobs />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--teal-light)', borderRadius: '100px',
              padding: '8px 18px', marginBottom: '28px',
              border: '1px solid rgba(74,155,142,0.25)',
            }}
          >
            <Zap size={14} color="var(--teal)" />
            <span style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: '600' }}>
              AI-Powered Study Platform for Kenyan Students
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: '800',
              lineHeight: 1.15,
              marginBottom: '20px',
              color: 'var(--text-dark)',
            }}
          >
            The shortcut to<br />
            <TypingText />
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: 'var(--text-mid)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Find past papers from UoN, KU, JKUAT and more. Ask Mkato AI to explain any answer.
            Generate notes, flashcards, and practice exams — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.05, background: 'var(--teal-dark)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'var(--teal)', color: 'white',
                border: 'none', borderRadius: '12px',
                padding: '16px 32px', fontSize: '16px',
                fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 8px 24px rgba(74,155,142,0.35)',
              }}
            >
              Start for Free
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'var(--teal)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'transparent', color: 'var(--text-dark)',
                border: '2px solid rgba(74,155,142,0.4)', borderRadius: '12px',
                padding: '16px 32px', fontSize: '16px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              See how it works
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              marginTop: '48px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex' }}>
              {['#4A9B8E','#5B7FA6','#6B9E7A','#4A9B8E','#357A6E'].map((c, i) => (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: c, border: '2px solid var(--off-white)',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'white', fontWeight: '700',
                }}>
                  {['A','B','C','D','E'][i]}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#EF9F27" color="#EF9F27" />)}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-mid)' }}>
              Join <strong>500+</strong> students already studying smarter
            </span>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{
        background: 'var(--off-white)',
        padding: '60px 24px',
        borderTop: '1px solid rgba(74,155,142,0.1)',
        borderBottom: '1px solid rgba(74,155,142,0.1)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
        }}>
          <StatItem number="10K+" label="Past papers uploaded" delay={0} />
          <StatItem number="6" label="Kenyan universities" delay={0.1} />
          <StatItem number="Ksh 199" label="Per month — less than a text book" delay={0.2} />
          <StatItem number="24/7" label="Mkato AI always available" delay={0.3} />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '14px' }}>
            Everything you need to pass
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-mid)', maxWidth: '520px', margin: '0 auto' }}>
            Not just a file dump — a full study platform built for how Kenyan students actually study.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <FeatureCard delay={0} icon={BookOpen} title="10,000+ Past Papers" desc="Search by university, course unit, and year. UoN, KU, JKUAT, Strathmore and more. Download instantly." />
          <FeatureCard delay={0.1} icon={Brain} title="Mkato AI Tutor" desc="Ask any question about a past paper. Get step-by-step explanations in English or Kiswahili." color="var(--blue-light)" />
          <FeatureCard delay={0.2} icon={Zap} title="Pass Predictor" desc="See which topics appear most in past papers. Know exactly what to focus on before your exam." />
          <FeatureCard delay={0.3} icon={CheckCircle} title="Answer Marking" desc="Write your answer and Mkato AI marks it against the marking scheme. Like having a personal examiner." color="var(--blue-light)" />
          <FeatureCard delay={0.4} icon={Users} title="Study Rooms" desc="Study with your classmates in real-time. Share notes, discuss questions, and prepare together." />
          <FeatureCard delay={0.5} icon={Star} title="Smart Flashcards" desc="AI generates flashcards from any past paper automatically. Study on the matatu with no data needed." color="var(--blue-light)" />
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" style={{
        background: 'var(--off-white)', padding: '100px 24px',
        borderTop: '1px solid rgba(74,155,142,0.1)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '14px' }}>
            Simple, student-friendly pricing
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-mid)' }}>Less than a mandazi a day.</p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px', maxWidth: '900px', margin: '0 auto',
        }}>
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'var(--eggshell)', borderRadius: '20px',
              padding: '36px 28px', border: '1px solid rgba(74,155,142,0.2)',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '8px' }}>FREE</p>
            <p style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>Ksh 0</p>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '28px' }}>Forever free</p>
            {['3 paper downloads/day', '5 Mkato AI queries/day', 'Upload papers to earn days', 'Basic notes editor'].map(f => (
              <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <CheckCircle size={16} color="var(--teal)" />
                <span style={{ fontSize: '14px', color: 'var(--text-mid)' }}>{f}</span>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', marginTop: '24px', padding: '14px',
                background: 'transparent', border: '2px solid var(--teal)',
                borderRadius: '10px', color: 'var(--teal)',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
              }}
            >
              Start Free
            </motion.button>
          </motion.div>

          {/* Paid plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--teal)', borderRadius: '20px',
              padding: '36px 28px',
              boxShadow: '0 20px 50px rgba(74,155,142,0.35)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#EF9F27', borderRadius: '100px',
              padding: '4px 12px', fontSize: '11px', fontWeight: '700', color: 'white',
            }}>
              MOST POPULAR
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>STUDENT PLAN</p>
            <p style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Ksh 199</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '28px' }}>per month • cancel anytime</p>
            {['Unlimited paper downloads', 'Unlimited Mkato AI', 'Answer marking', 'Flashcard generator', 'Study rooms', 'Offline access', 'Pass Predictor'].map(f => (
              <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <CheckCircle size={16} color="rgba(255,255,255,0.9)" />
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{f}</span>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.03, background: '#2C8C80' }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', marginTop: '24px', padding: '14px',
                background: 'white', border: 'none',
                borderRadius: '10px', color: 'var(--teal)',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
              }}
            >
              Get Student Plan
            </motion.button>
          </motion.div>

          {/* Crammer plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'var(--eggshell)', borderRadius: '20px',
              padding: '36px 28px', border: '1px solid rgba(74,155,142,0.2)',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '8px' }}>EXAM CRAMMER</p>
            <p style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>Ksh 499</p>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '28px' }}>one-time • 30 days • no auto-renew</p>
            {['Everything in Student Plan', '30 days full access', 'No subscription needed', 'Perfect before exams'].map(f => (
              <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <CheckCircle size={16} color="var(--teal)" />
                <span style={{ fontSize: '14px', color: 'var(--text-mid)' }}>{f}</span>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', marginTop: '24px', padding: '14px',
                background: 'transparent', border: '2px solid var(--teal)',
                borderRadius: '10px', color: 'var(--teal)',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
              }}
            >
              Get Crammer Pack
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: 'var(--text-dark)', color: 'white',
        padding: '48px 24px', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={28} height={28} />
          <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--teal)' }}>mkato.study</span>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Making things simpler.</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2025 Mkato.study. Built in Kenya 🇰🇪</p>
      </footer>

    </main>
  )
}