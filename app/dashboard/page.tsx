'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BookOpen, Brain, Zap, Search, Upload, Star, LogOut, User, Bell, TrendingUp, Clock, Award, ChevronRight, FileText, X, CheckCheck, Sparkles, GiftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────
type UserProfile = {
  email: string
  full_name?: string
  avatar_url?: string
}

type Notification = {
  id: string
  icon: 'bell' | 'gift' | 'sparkles' | 'zap'
  title: string
  body: string
  time: string
  read: boolean
  href?: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'sparkles',
    title: 'Welcome to Mkato.study! 🎉',
    body: 'You have 3 free paper downloads and 5 AI queries waiting for you today.',
    time: 'Just now',
    read: false,
    href: '/papers',
  },
  {
    id: '2',
    icon: 'gift',
    title: 'Earn 7 free premium days',
    body: 'Upload a past paper you have and get 7 days of unlimited access instantly.',
    time: '2 min ago',
    read: false,
    href: '/upload',
  },
  {
    id: '3',
    icon: 'zap',
    title: 'Pass Predictor is ready',
    body: 'See which topics appear most across 5 years of past papers before your exam.',
    time: '1 hr ago',
    read: false,
    href: '/predictor',
  },
  {
    id: '4',
    icon: 'bell',
    title: 'Tip: Study in short bursts',
    body: 'Research shows 25-minute focused sessions beat 3-hour cramming. Try it today.',
    time: 'Today',
    read: true,
  },
]

// ─── Notification panel ───────────────────────────────────────────────────────
function NotificationPanel({
  notifs,
  onRead,
  onReadAll,
  onClose,
}: {
  notifs: Notification[]
  onRead: (id: string) => void
  onReadAll: () => void
  onClose: () => void
}) {
  const iconMap = {
    bell: Bell,
    gift: GiftIcon,
    sparkles: Sparkles,
    zap: Zap,
  }
  const colorMap = {
    bell: 'var(--teal-light)',
    gift: '#FAEEDA',
    sparkles: 'var(--blue-light)',
    zap: '#EAF3DE',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'absolute', top: '52px', right: 0,
        width: '360px', background: 'var(--off-white)',
        borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
        border: '1px solid rgba(74,155,142,0.15)',
        zIndex: 200, overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid rgba(74,155,142,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="var(--teal)" />
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)' }}>Notifications</span>
          {notifs.filter(n => !n.read).length > 0 && (
            <span style={{
              background: '#EF4444', color: 'white',
              fontSize: '11px', fontWeight: '700',
              padding: '1px 7px', borderRadius: '100px',
            }}>{notifs.filter(n => !n.read).length}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.button
            whileHover={{ color: 'var(--teal)' }}
            onClick={onReadAll}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', color: 'var(--text-mid)', fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <CheckCheck size={13} /> Mark all read
          </motion.button>
          <motion.button
            whileHover={{ background: 'var(--eggshell)' }}
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              width: '26px', height: '26px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} color="var(--text-mid)" />
          </motion.button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {notifs.map(n => {
          const IconComp = iconMap[n.icon]
          return (
            <motion.div
              key={n.id}
              whileHover={{ background: 'var(--eggshell)' }}
              onClick={() => onRead(n.id)}
              style={{
                display: 'flex', gap: '12px', padding: '14px 20px',
                borderBottom: '1px solid rgba(74,155,142,0.07)',
                cursor: 'pointer', transition: 'background 0.15s',
                background: n.read ? 'transparent' : 'rgba(74,155,142,0.04)',
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: colorMap[n.icon], flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconComp size={16} color="var(--teal)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <span style={{
                    fontSize: '13px', fontWeight: n.read ? '500' : '700',
                    color: 'var(--text-dark)', lineHeight: 1.3,
                  }}>{n.title}</span>
                  {!n.read && (
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--teal)', flexShrink: 0, marginTop: '3px', marginLeft: '6px',
                    }} />
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: '4px' }}>{n.body}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{n.time}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', textAlign: 'center', borderTop: '1px solid rgba(74,155,142,0.1)' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>That's all your notifications</span>
      </div>
    </motion.div>
  )
}

// ─── Sidebar link ─────────────────────────────────────────────────────────────
function SidebarLink({ icon: Icon, label, active, href }: {
  icon: any, label: string, active?: boolean, href: string
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ x: 4, background: 'var(--teal-light)' }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 16px', borderRadius: '10px',
          background: active ? 'var(--teal-light)' : 'transparent',
          cursor: 'pointer', transition: 'background 0.2s',
          marginBottom: '4px',
        }}
      >
        <Icon size={18} color={active ? 'var(--teal)' : 'var(--text-mid)'} />
        <span style={{
          fontSize: '14px', fontWeight: active ? '600' : '500',
          color: active ? 'var(--teal)' : 'var(--text-mid)',
        }}>
          {label}
        </span>
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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: any, label: string, value: string, color: string, delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(74,155,142,0.12)' }}
      style={{
        background: 'var(--off-white)', borderRadius: '16px',
        padding: '20px 24px', border: '1px solid rgba(74,155,142,0.12)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '14px',
      }}>
        <Icon size={20} color="var(--teal)" />
      </div>
      <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>{value}</p>
      <p style={{ fontSize: '13px', color: 'var(--text-mid)' }}>{label}</p>
    </motion.div>
  )
}

// ─── Recent paper card ────────────────────────────────────────────────────────
function PaperCard({ title, university, year, delay }: {
  title: string, university: string, year: string, delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 4, background: 'var(--teal-light)' }}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', borderRadius: '12px',
        border: '1px solid rgba(74,155,142,0.1)',
        background: 'var(--off-white)', cursor: 'pointer',
        transition: 'all 0.2s', marginBottom: '10px',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: 'var(--teal-light)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FileText size={18} color="var(--teal)" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '3px' }}>{title}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{university} • {year}</p>
      </div>
      <ChevronRight size={16} color="var(--text-light)" />
    </motion.div>
  )
}

// ─── Quick action button ───────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, desc, color, delay, href }: {
  icon: any, label: string, desc: string, color: string, delay: number, href: string
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(74,155,142,0.15)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: color, borderRadius: '16px',
          padding: '20px', cursor: 'pointer',
          border: '1px solid rgba(74,155,142,0.15)',
          transition: 'box-shadow 0.2s',
        }}
      >
        <Icon size={24} color="var(--teal)" style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-mid)', lineHeight: 1.5 }}>{desc}</p>
      </motion.div>
    </Link>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good morning')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const supabase = createClient()

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Get user
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        })
      } else {
        // Not logged in — redirect to login
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

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--eggshell)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px', height: '40px',
            border: '3px solid rgba(74,155,142,0.2)',
            borderTop: '3px solid var(--teal)', borderRadius: '50%',
          }}
        />
      </div>
    )
  }

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--eggshell)' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '240px', minHeight: '100vh',
          background: 'var(--off-white)',
          borderRight: '1px solid rgba(74,155,142,0.12)',
          padding: '24px 16px',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={32} height={32} />
          <span style={{ fontWeight: '800', fontSize: '17px', color: 'var(--teal)' }}>
            mkato<span style={{ color: 'var(--blue)' }}>.study</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '16px' }}>
            MAIN
          </p>
          <SidebarLink icon={TrendingUp} label="Dashboard" active href="/dashboard" />
          <SidebarLink icon={Search} label="Find Papers" href="/papers" />
          <SidebarLink icon={Brain} label="Mkato AI" href="/ai" />
          <SidebarLink icon={Upload} label="Upload Paper" href="/upload" />

          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.08em', margin: '20px 0 8px', paddingLeft: '16px' }}>
            STUDY TOOLS
          </p>
          <SidebarLink icon={Star} label="Flashcards" href="/flashcards" />
          <SidebarLink icon={Award} label="Pass Predictor" href="/predictor" />
          <SidebarLink icon={Clock} label="Study Planner" href="/planner" />
          <SidebarLink icon={BookOpen} label="My Notes" href="/notes" />
        </div>

        {/* User profile at bottom */}
        <div style={{
          borderTop: '1px solid rgba(74,155,142,0.12)',
          paddingTop: '16px', marginTop: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', marginBottom: '8px' }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--teal)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
                  {firstName[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {firstName}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Free plan
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ background: '#FCEBEB', color: '#791F1F' }}
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 16px',
              background: 'transparent', border: '1px solid rgba(74,155,142,0.15)',
              borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', fontWeight: '500', color: 'var(--text-mid)',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={15} />
            Sign out
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', maxWidth: 'calc(100vw - 240px)' }}>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '32px',
          }}
        >
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>{greeting} 👋</p>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-dark)' }}>
              Welcome back, {firstName}!
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification bell */}
            <div style={{ position: 'relative' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifOpen(o => !o)}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: notifOpen ? 'var(--teal-light)' : 'var(--off-white)',
                  border: `1px solid ${notifOpen ? 'rgba(74,155,142,0.4)' : 'rgba(74,155,142,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <Bell size={18} color={notifOpen ? 'var(--teal)' : 'var(--text-mid)'} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: '-5px', right: '-5px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#EF4444', border: '2px solid var(--eggshell)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: '700', color: 'white',
                    }}
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {notifOpen && (
                  <NotificationPanel
                    notifs={notifications}
                    onRead={markRead}
                    onReadAll={markAllRead}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </AnimatePresence>

              {/* Click outside overlay */}
              {notifOpen && (
                <div
                  onClick={() => setNotifOpen(false)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 199,
                  }}
                />
              )}
            </div>

            {/* Upgrade badge */}
            <Link href="/upgrade" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--teal)', borderRadius: '10px',
                  padding: '10px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <Zap size={14} color="white" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>Upgrade — Ksh 199</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          <StatCard icon={BookOpen} label="Papers viewed" value="0" color="var(--teal-light)" delay={0.1} />
          <StatCard icon={Brain} label="AI queries today" value="0/5" color="var(--blue-light)" delay={0.2} />
          <StatCard icon={Star} label="Flashcards created" value="0" color="#EAF3DE" delay={0.3} />
          <StatCard icon={Award} label="Study streak" value="1 day" color="#FAEEDA" delay={0.4} />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

          {/* Left column */}
          <div>
            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: '28px' }}
            >
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '14px' }}>
                Quick actions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <QuickAction icon={Search} label="Find Papers" desc="Search 10,000+ past papers" color="var(--teal-light)" delay={0.35} href="/papers" />
                <QuickAction icon={Brain} label="Ask Mkato AI" desc="Get instant explanations" color="var(--blue-light)" delay={0.4} href="/ai" />
                <QuickAction icon={Upload} label="Upload Paper" desc="Earn free premium days" color="#EAF3DE" delay={0.45} href="/upload" />
                <QuickAction icon={Zap} label="Pass Predictor" desc="See likely exam topics" color="#FAEEDA" delay={0.5} href="/predictor" />
              </div>
            </motion.div>

            {/* Recent papers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Recently viewed papers
                </h2>
                <Link href="/papers" style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '500' }}>
                  View all →
                </Link>
              </div>

              {/* Empty state */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  textAlign: 'center', padding: '48px 24px',
                  background: 'var(--off-white)', borderRadius: '16px',
                  border: '1px dashed rgba(74,155,142,0.25)',
                }}
              >
                <BookOpen size={40} color="rgba(74,155,142,0.3)" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '6px' }}>
                  No papers viewed yet
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px' }}>
                  Search for your first past paper to get started
                </p>
                <Link href="/papers">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: 'var(--teal)', color: 'white',
                      border: 'none', borderRadius: '10px',
                      padding: '10px 20px', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    Find Past Papers
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right column */}
          <div>
            {/* Free plan progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'var(--off-white)', borderRadius: '16px',
                padding: '20px', border: '1px solid rgba(74,155,142,0.12)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)' }}>Free Plan</h3>
                <span style={{
                  background: 'var(--teal-light)', color: 'var(--teal)',
                  fontSize: '11px', fontWeight: '600',
                  padding: '3px 10px', borderRadius: '100px',
                }}>FREE</span>
              </div>

              {/* Downloads */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-mid)' }}>Paper downloads</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>0 / 3</span>
                </div>
                <div style={{ height: '6px', background: 'var(--eggshell)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--teal)', borderRadius: '3px' }} />
                </div>
              </div>

              {/* AI queries */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-mid)' }}>AI queries today</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>0 / 5</span>
                </div>
                <div style={{ height: '6px', background: 'var(--eggshell)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--blue)', borderRadius: '3px' }} />
                </div>
              </div>

              <Link href="/upgrade" style={{ textDecoration: 'none', display: 'block' }}>
                <motion.button
                  whileHover={{ scale: 1.03, background: 'var(--teal-dark)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'var(--teal)', border: 'none',
                    borderRadius: '10px', color: 'white',
                    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Upgrade — Ksh 199/mo
                </motion.button>
              </Link>
              <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>
                Or upload a paper to earn 7 free days
              </p>
            </motion.div>

            {/* Study tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, var(--teal) 0%, var(--blue) 100%)',
                borderRadius: '16px', padding: '20px',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                💡 MKATO TIP
              </p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', lineHeight: 1.6, marginBottom: '12px' }}>
                Upload a past paper you have and earn <strong>7 days of free premium</strong> access instantly.
              </p>
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px', padding: '8px 16px',
                    color: 'white', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  Upload now →
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
