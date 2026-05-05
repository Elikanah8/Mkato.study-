 
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

// ─── Floating blobs (same as homepage) ───────────────────────────────────────
function Blobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
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
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,127,166,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ─── Google icon SVG ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ─── GitHub icon SVG ──────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

// ─── Main login page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  // ── Google login ────────────────────────────────────────────────────────────
  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // ── GitHub login ────────────────────────────────────────────────────────────
  async function handleGitHubLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // ── Email login / signup ────────────────────────────────────────────────────
  async function handleEmailAuth() {
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in both email and password.')
      setLoading(false)
      return
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) setError(error.message)
      else setSuccess('Check your email for a confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Wrong email or password. Try again.')
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh', background: 'var(--eggshell)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative',
    }}>
      <Blobs />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 1,
          background: 'var(--off-white)',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%', maxWidth: '440px',
          border: '1px solid rgba(74,155,142,0.15)',
          boxShadow: '0 20px 60px rgba(44,44,44,0.08)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '28px' }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={52} height={52} />
            <span style={{ fontWeight: '800', fontSize: '22px', color: 'var(--teal)' }}>
              mkato<span style={{ color: 'var(--blue)' }}>.study</span>
            </span>
          </Link>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
            Making things simpler.
          </p>
        </motion.div>

        {/* Mode toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex', background: 'var(--eggshell)',
            borderRadius: '12px', padding: '4px',
            marginBottom: '28px',
          }}
        >
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess('') }}
              style={{
                flex: 1, padding: '10px',
                borderRadius: '10px', border: 'none',
                background: mode === m ? 'var(--teal)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-mid)',
                fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </motion.div>

        {/* Social buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}
        >
          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(74,155,142,0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'white', border: '1.5px solid rgba(74,155,142,0.25)',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)',
              transition: 'border-color 0.2s',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          {/* GitHub */}
          <motion.button
            whileHover={{ scale: 1.02, background: '#24292e', color: 'white' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGitHubLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'var(--eggshell)', border: '1.5px solid rgba(44,44,44,0.15)',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)',
              transition: 'all 0.2s',
            }}
          >
            <GitHubIcon />
            Continue with GitHub
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(74,155,142,0.15)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '500' }}>or use email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(74,155,142,0.15)' }} />
        </motion.div>

        {/* Email field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ marginBottom: '14px' }}
        >
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '6px' }}>
            Email address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.ac.ke"
              style={{
                width: '100%', padding: '13px 14px 13px 42px',
                background: 'var(--eggshell)',
                border: '1.5px solid rgba(74,155,142,0.2)',
                borderRadius: '10px', fontSize: '14px',
                color: 'var(--text-dark)', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(74,155,142,0.2)'}
            />
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)' }}>
              Password
            </label>
            {mode === 'login' && (
              <a href="#" style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: '500' }}>
                Forgot password?
              </a>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
              style={{
                width: '100%', padding: '13px 42px 13px 42px',
                background: 'var(--eggshell)',
                border: '1.5px solid rgba(74,155,142,0.2)',
                borderRadius: '10px', fontSize: '14px',
                color: 'var(--text-dark)', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(74,155,142,0.2)'}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {showPassword
                ? <EyeOff size={16} color="var(--text-light)" />
                : <Eye size={16} color="var(--text-light)" />
              }
            </button>
          </div>
        </motion.div>

        {/* Error / success messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#FCEBEB', border: '1px solid rgba(226,75,74,0.2)',
              borderRadius: '10px', padding: '12px 14px',
              fontSize: '13px', color: '#791F1F',
              marginBottom: '16px',
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--teal-light)', border: '1px solid rgba(74,155,142,0.2)',
              borderRadius: '10px', padding: '12px 14px',
              fontSize: '13px', color: 'var(--teal-dark)',
              marginBottom: '16px',
            }}
          >
            ✅ {success}
          </motion.div>
        )}

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, background: 'var(--teal-dark)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEmailAuth}
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading ? 'rgba(74,155,142,0.6)' : 'var(--teal)',
              border: 'none', borderRadius: '12px',
              color: 'white', fontSize: '15px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '18px', height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white', borderRadius: '50%',
                  }}
                />
                Please wait...
              </>
            ) : (
              <>
                {mode === 'login' ? 'Log In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ textAlign: 'center', marginTop: '24px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginBottom: '12px',
          }}>
            <BookOpen size={14} color="var(--teal)" />
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
              Join <strong style={{ color: 'var(--teal)' }}>500+</strong> students passing their exams
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: 1.6 }}>
            By continuing you agree to our{' '}
            <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}
