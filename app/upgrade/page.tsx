'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, Phone, Loader, ChevronLeft, Zap, Shield, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

type Plan = {
    id: string
    name: string
    price: number
    period: string
    description: string
    features: string[]
    highlight: boolean
}

const PLANS: Plan[] = [
    {
        id: 'monthly',
        name: 'Student Plan',
        price: 199,
        period: 'per month',
        description: 'Best for active students',
        highlight: true,
        features: [
            'Unlimited paper downloads',
            'Unlimited Mkato AI queries',
            'Answer marking',
            'Flashcard generator',
            'Study rooms',
            'Offline access',
            'Pass Predictor',
        ],
    },
    {
        id: 'crammer',
        name: 'Exam Crammer',
        price: 499,
        period: 'one-time — 30 days',
        description: 'Perfect before exams',
        highlight: false,
        features: [
            'Everything in Student Plan',
            '30 days full access',
            'No subscription needed',
            'No auto-renewal',
        ],
    },
]

export default function UpgradePage() {
    const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0])
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'plans' | 'pay' | 'waiting' | 'success' | 'error'>('plans')
    const [error, setError] = useState('')
    const [userId, setUserId] = useState('')

    const supabase = createClient()

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
            else window.location.href = '/login'
        }
        getUser()
    }, [])

    async function initiatePayment() {
        if (!phone) {
            setError('Please enter your M-Pesa phone number.')
            return
        }

        if (phone.length < 9) {
            setError('Please enter a valid phone number.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/mpesa/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    amount: selectedPlan.price,
                    userId,
                }),
            })

            const data = await res.json()

            if (data.success) {
                setStep('waiting')
            } else {
                setError(data.error || 'Payment failed. Please try again.')
                setStep('pay')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--eggshell)', padding: '36px 24px' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <Link href="/dashboard" style={{
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                        gap: '4px', fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px',
                    }}>
                        <ChevronLeft size={14} /> Dashboard
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={32} height={32} />
                        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-dark)' }}>
                            Upgrade your account
                        </h1>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                        Unlock unlimited access. Pay securely with M-Pesa.
                    </p>
                </div>

                <AnimatePresence mode="wait">

                    {/* Step 1 — Choose plan */}
                    {step === 'plans' && (
                        <motion.div
                            key="plans"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                                {PLANS.map(plan => (
                                    <motion.div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        whileHover={{ y: -2 }}
                                        style={{
                                            background: selectedPlan.id === plan.id
                                                ? plan.highlight ? 'var(--teal)' : 'var(--off-white)'
                                                : 'var(--off-white)',
                                            borderRadius: '16px', padding: '24px 20px',
                                            border: selectedPlan.id === plan.id
                                                ? `2px solid ${plan.highlight ? 'var(--teal)' : 'var(--teal)'}`
                                                : '2px solid rgba(74,155,142,0.12)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            position: 'relative',
                                        }}
                                    >
                                        {plan.highlight && selectedPlan.id === plan.id && (
                                            <span style={{
                                                position: 'absolute', top: '-10px', left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: '#EF9F27', borderRadius: '100px',
                                                padding: '3px 12px', fontSize: '10px',
                                                fontWeight: '700', color: 'white', whiteSpace: 'nowrap',
                                            }}>
                                                MOST POPULAR
                                            </span>
                                        )}

                                        <p style={{
                                            fontSize: '12px', fontWeight: '700',
                                            color: selectedPlan.id === plan.id && plan.highlight
                                                ? 'rgba(255,255,255,0.7)' : 'var(--text-mid)',
                                            marginBottom: '6px', letterSpacing: '0.05em',
                                        }}>
                                            {plan.name.toUpperCase()}
                                        </p>

                                        <p style={{
                                            fontSize: '32px', fontWeight: '800',
                                            color: selectedPlan.id === plan.id && plan.highlight
                                                ? 'white' : 'var(--text-dark)',
                                            marginBottom: '2px',
                                        }}>
                                            Ksh {plan.price}
                                        </p>

                                        <p style={{
                                            fontSize: '12px',
                                            color: selectedPlan.id === plan.id && plan.highlight
                                                ? 'rgba(255,255,255,0.6)' : 'var(--text-light)',
                                            marginBottom: '16px',
                                        }}>
                                            {plan.period}
                                        </p>

                                        {plan.features.slice(0, 3).map(f => (
                                            <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                                <CheckCircle
                                                    size={13}
                                                    color={selectedPlan.id === plan.id && plan.highlight
                                                        ? 'rgba(255,255,255,0.8)' : 'var(--teal)'}
                                                />
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: selectedPlan.id === plan.id && plan.highlight
                                                        ? 'rgba(255,255,255,0.85)' : 'var(--text-mid)',
                                                }}>
                                                    {f}
                                                </span>
                                            </div>
                                        ))}

                                        {plan.features.length > 3 && (
                                            <p style={{
                                                fontSize: '11px',
                                                color: selectedPlan.id === plan.id && plan.highlight
                                                    ? 'rgba(255,255,255,0.6)' : 'var(--text-light)',
                                                marginTop: '4px',
                                            }}>
                                                +{plan.features.length - 3} more features
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trust badges */}
                            <div style={{
                                display: 'flex', gap: '16px', marginBottom: '24px',
                                flexWrap: 'wrap',
                            }}>
                                {[
                                    { icon: Shield, text: 'Secure M-Pesa payment' },
                                    { icon: Clock, text: 'Instant activation' },
                                    { icon: Zap, text: 'Cancel anytime' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '12px', color: 'var(--text-mid)',
                                    }}>
                                        <Icon size={13} color="var(--teal)" />
                                        {text}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep('pay')}
                                style={{
                                    width: '100%', padding: '14px',
                                    background: 'var(--teal)', border: 'none',
                                    borderRadius: '12px', cursor: 'pointer',
                                    fontSize: '15px', fontWeight: '700', color: 'white',
                                }}
                            >
                                Continue with {selectedPlan.name} — Ksh {selectedPlan.price}
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2 — Enter phone */}
                    {step === 'pay' && (
                        <motion.div
                            key="pay"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: 'var(--off-white)', borderRadius: '16px',
                                padding: '32px', border: '1px solid rgba(74,155,142,0.12)',
                            }}
                        >
                            {/* Selected plan summary */}
                            <div style={{
                                background: 'var(--teal-light)', borderRadius: '10px',
                                padding: '14px 16px', marginBottom: '24px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--teal)', margin: '0 0 2px' }}>
                                        {selectedPlan.name}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--teal)', margin: 0, opacity: 0.8 }}>
                                        {selectedPlan.period}
                                    </p>
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--teal)', margin: 0 }}>
                                    Ksh {selectedPlan.price}
                                </p>
                            </div>

                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                                Enter your M-Pesa number
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>
                                You will receive an STK push on this number to confirm payment.
                            </p>

                            {/* Phone input */}
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                <div style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    borderRight: '1px solid rgba(74,155,142,0.2)',
                                    paddingRight: '10px',
                                }}>
                                    <span style={{ fontSize: '14px' }}>🇰🇪</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)' }}>+254</span>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="7XX XXX XXX"
                                    maxLength={10}
                                    style={{
                                        width: '100%', padding: '13px 14px 13px 90px',
                                        background: 'var(--eggshell)',
                                        border: '1.5px solid rgba(74,155,142,0.18)',
                                        borderRadius: '10px', fontSize: '15px',
                                        color: 'var(--text-dark)', outline: 'none',
                                        boxSizing: 'border-box', letterSpacing: '0.05em',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            fontSize: '13px', color: '#791F1F',
                                            background: '#FCEBEB', borderRadius: '8px',
                                            padding: '10px 14px', marginBottom: '14px',
                                        }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={initiatePayment}
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '14px',
                                    background: loading ? 'rgba(74,155,142,0.5)' : 'var(--teal)',
                                    border: 'none', borderRadius: '10px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '15px', fontWeight: '700', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    marginBottom: '12px',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                                            style={{
                                                width: '16px', height: '16px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid white', borderRadius: '50%',
                                            }}
                                        />
                                        Sending STK push...
                                    </>
                                ) : (
                                    <>
                                        <Phone size={16} />
                                        Pay Ksh {selectedPlan.price} via M-Pesa
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep('plans')}
                                style={{
                                    width: '100%', padding: '11px',
                                    background: 'transparent', border: 'none',
                                    cursor: 'pointer', fontSize: '13px',
                                    color: 'var(--text-light)', fontWeight: '500',
                                }}
                            >
                                Back to plans
                            </button>
                        </motion.div>
                    )}

                    {/* Step 3 — Waiting for payment */}
                    {step === 'waiting' && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: 'var(--off-white)', borderRadius: '16px',
                                padding: '60px 40px', textAlign: 'center',
                                border: '1px solid rgba(74,155,142,0.12)',
                            }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'var(--teal-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}
                            >
                                <Phone size={28} color="var(--teal)" />
                            </motion.div>

                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                                Check your phone
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: '6px' }}>
                                An M-Pesa prompt has been sent to your phone.
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '32px' }}>
                                Enter your M-Pesa PIN to complete the payment.
                            </p>

                            <div style={{
                                background: 'var(--eggshell)', borderRadius: '10px',
                                padding: '14px 20px', marginBottom: '28px',
                                fontSize: '13px', color: 'var(--text-mid)', lineHeight: 1.7,
                            }}>
                                <strong>Did not receive the prompt?</strong><br />
                                Dial <strong>*150*00#</strong> on your phone and follow the M-Pesa menu.
                            </div>

                            <button
                                onClick={() => setStep('success')}
                                style={{
                                    padding: '11px 28px', background: 'var(--teal)',
                                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600', color: 'white',
                                    marginBottom: '10px', width: '100%',
                                }}
                            >
                                I have completed the payment
                            </button>

                            <button
                                onClick={() => setStep('pay')}
                                style={{
                                    padding: '11px 28px', background: 'transparent',
                                    border: 'none', cursor: 'pointer',
                                    fontSize: '13px', color: 'var(--text-light)', width: '100%',
                                }}
                            >
                                Try again
                            </button>
                        </motion.div>
                    )}

                    {/* Step 4 — Success */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: 'var(--off-white)', borderRadius: '16px',
                                padding: '60px 40px', textAlign: 'center',
                                border: '1px solid rgba(74,155,142,0.12)',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'var(--teal-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}
                            >
                                <CheckCircle size={32} color="var(--teal)" />
                            </motion.div>

                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                                Payment received
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: '32px' }}>
                                Welcome to {selectedPlan.name}. Your account has been upgraded and all features are now unlocked.
                            </p>

                            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '13px 32px', background: 'var(--teal)',
                                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                                    fontSize: '15px', fontWeight: '700', color: 'white',
                                }}>
                                    Go to dashboard
                                </button>
                            </Link>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}

