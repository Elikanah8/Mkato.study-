'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { TrendingUp, ChevronLeft, AlertCircle, CheckCircle, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Topic = {
    name: string
    appearances: number
    outOf: number
    trend: 'rising' | 'stable' | 'falling'
}

type Course = {
    code: string
    name: string
    university: string
    topics: Topic[]
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const COURSES: Course[] = [
    {
        code: 'BCOM 201',
        name: 'Introduction to Economics',
        university: 'University of Nairobi',
        topics: [
            { name: 'Supply and Demand', appearances: 9, outOf: 10, trend: 'rising' },
            { name: 'Price Elasticity', appearances: 8, outOf: 10, trend: 'stable' },
            { name: 'Market Structures', appearances: 7, outOf: 10, trend: 'stable' },
            { name: 'Opportunity Cost', appearances: 7, outOf: 10, trend: 'rising' },
            { name: 'Consumer Theory', appearances: 6, outOf: 10, trend: 'rising' },
            { name: 'Production and Costs', appearances: 6, outOf: 10, trend: 'stable' },
            { name: 'National Income Accounting', appearances: 5, outOf: 10, trend: 'falling' },
            { name: 'Monetary Policy', appearances: 4, outOf: 10, trend: 'rising' },
            { name: 'Fiscal Policy', appearances: 4, outOf: 10, trend: 'stable' },
            { name: 'International Trade', appearances: 3, outOf: 10, trend: 'falling' },
        ],
    },
    {
        code: 'BCOM 202',
        name: 'Financial Accounting',
        university: 'University of Nairobi',
        topics: [
            { name: 'Trial Balance', appearances: 10, outOf: 10, trend: 'stable' },
            { name: 'Income Statement', appearances: 9, outOf: 10, trend: 'stable' },
            { name: 'Balance Sheet', appearances: 9, outOf: 10, trend: 'stable' },
            { name: 'Bank Reconciliation', appearances: 8, outOf: 10, trend: 'rising' },
            { name: 'Depreciation', appearances: 7, outOf: 10, trend: 'stable' },
            { name: 'Ledger Accounts', appearances: 7, outOf: 10, trend: 'falling' },
            { name: 'Cash Flow Statement', appearances: 6, outOf: 10, trend: 'rising' },
            { name: 'Partnership Accounts', appearances: 5, outOf: 10, trend: 'stable' },
            { name: 'Company Accounts', appearances: 4, outOf: 10, trend: 'rising' },
            { name: 'Ratio Analysis', appearances: 3, outOf: 10, trend: 'falling' },
        ],
    },
    {
        code: 'MATH 101',
        name: 'Calculus I',
        university: 'Kenyatta University',
        topics: [
            { name: 'Differentiation', appearances: 10, outOf: 10, trend: 'stable' },
            { name: 'Integration', appearances: 9, outOf: 10, trend: 'stable' },
            { name: 'Limits and Continuity', appearances: 8, outOf: 10, trend: 'stable' },
            { name: 'Applications of Derivatives', appearances: 8, outOf: 10, trend: 'rising' },
            { name: 'Chain Rule', appearances: 7, outOf: 10, trend: 'rising' },
            { name: 'Definite Integrals', appearances: 6, outOf: 10, trend: 'stable' },
            { name: 'Series and Sequences', appearances: 5, outOf: 10, trend: 'falling' },
            { name: 'Partial Fractions', appearances: 4, outOf: 10, trend: 'stable' },
        ],
    },
    {
        code: 'CSC 212',
        name: 'Database Systems',
        university: 'JKUAT',
        topics: [
            { name: 'SQL Queries', appearances: 10, outOf: 10, trend: 'stable' },
            { name: 'Normalization', appearances: 9, outOf: 10, trend: 'stable' },
            { name: 'Entity Relationship Diagrams', appearances: 9, outOf: 10, trend: 'rising' },
            { name: 'Transactions and ACID', appearances: 7, outOf: 10, trend: 'rising' },
            { name: 'Indexing', appearances: 6, outOf: 10, trend: 'stable' },
            { name: 'Joins and Subqueries', appearances: 6, outOf: 10, trend: 'rising' },
            { name: 'Database Security', appearances: 4, outOf: 10, trend: 'falling' },
            { name: 'Stored Procedures', appearances: 3, outOf: 10, trend: 'stable' },
        ],
    },
]

const NAV = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Find Papers', href: '/papers' },
    { label: 'Mkato AI', href: '/ai' },
    { label: 'Upload Paper', href: '/upload' },
    { label: 'Flashcards', href: '/flashcards' },
    { label: 'Pass Predictor', href: '/predictor', active: true },
    { label: 'Study Planner', href: '/planner' },
    { label: 'My Notes', href: '/notes' },
]

// ─── Likelihood label ─────────────────────────────────────────────────────────
function getLikelihood(appearances: number, outOf: number) {
    const pct = (appearances / outOf) * 100
    if (pct >= 80) return { label: 'Very likely', color: '#0F6E56', bg: '#E1F5EE' }
    if (pct >= 60) return { label: 'Likely', color: '#4A9B8E', bg: '#EAF5F3' }
    if (pct >= 40) return { label: 'Possible', color: '#C87A00', bg: '#FFF4E6' }
    return { label: 'Unlikely', color: '#8A8A8A', bg: '#F1EFE8' }
}

// ─── Topic row ────────────────────────────────────────────────────────────────
function TopicRow({ topic, index }: { topic: Topic; index: number }) {
    const pct = Math.round((topic.appearances / topic.outOf) * 100)
    const likelihood = getLikelihood(topic.appearances, topic.outOf)

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            style={{
                padding: '14px 0',
                borderBottom: '1px solid rgba(74,155,142,0.08)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                {/* Rank */}
                <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: 'var(--text-light)', minWidth: '20px',
                }}>
                    {index + 1}
                </span>

                {/* Topic name */}
                <p style={{
                    fontSize: '14px', fontWeight: '600',
                    color: 'var(--text-dark)', flex: 1, margin: 0,
                }}>
                    {topic.name}
                </p>

                {/* Trend icon */}
                <div title={`Trend: ${topic.trend}`}>
                    {topic.trend === 'rising' && <TrendingUp size={14} color="#0F6E56" />}
                    {topic.trend === 'stable' && <Minus size={14} color="var(--text-light)" />}
                    {topic.trend === 'falling' && <TrendingUp size={14} color="#C87A00" style={{ transform: 'scaleY(-1)' }} />}
                </div>

                {/* Likelihood badge */}
                <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: likelihood.color, background: likelihood.bg,
                    borderRadius: '6px', padding: '3px 9px',
                    whiteSpace: 'nowrap',
                }}>
                    {likelihood.label}
                </span>

                {/* Percentage */}
                <span style={{
                    fontSize: '13px', fontWeight: '700',
                    color: 'var(--text-dark)', minWidth: '38px',
                    textAlign: 'right',
                }}>
                    {pct}%
                </span>
            </div>

            {/* Progress bar */}
            <div style={{
                height: '5px', background: 'var(--eggshell)',
                borderRadius: '3px', overflow: 'hidden',
                marginLeft: '32px',
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: index * 0.04 + 0.2, duration: 0.5, ease: 'easeOut' }}
                    style={{
                        height: '100%', borderRadius: '3px',
                        background: pct >= 80 ? '#0F6E56' : pct >= 60 ? 'var(--teal)' : pct >= 40 ? '#C87A00' : '#CCCCCC',
                    }}
                />
            </div>

            <p style={{
                fontSize: '11px', color: 'var(--text-light)',
                marginLeft: '32px', marginTop: '5px',
            }}>
                Appeared in {topic.appearances} of {topic.outOf} past papers
            </p>
        </motion.div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PredictorPage() {
    const [selected, setSelected] = useState<Course>(COURSES[0])

    const topTopics = selected.topics.filter(t => (t.appearances / t.outOf) >= 0.8)
    const likelyTopics = selected.topics.filter(t => {
        const r = t.appearances / t.outOf
        return r >= 0.6 && r < 0.8
    })

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
                                    if (!item.active) (e.currentTarget as HTMLDivElement).style.background = 'var(--eggshell)'
                                }}
                                onMouseLeave={e => {
                                    if (!item.active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
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
            </aside>

            {/* Main */}
            <main style={{ marginLeft: '220px', flex: 1, padding: '36px 40px' }}>

                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <Link href="/dashboard" style={{
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                        gap: '4px', fontSize: '13px', color: 'var(--text-light)', marginBottom: '12px',
                    }}>
                        <ChevronLeft size={14} /> Dashboard
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                        Pass Predictor
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                        Topics ranked by how often they appear across past papers. Focus on what matters most.
                    </p>
                </div>

                {/* Course selector */}
                <div style={{
                    display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px',
                }}>
                    {COURSES.map(course => (
                        <button
                            key={course.code}
                            onClick={() => setSelected(course)}
                            style={{
                                padding: '8px 16px',
                                background: selected.code === course.code ? 'var(--teal)' : 'var(--off-white)',
                                border: `1.5px solid ${selected.code === course.code ? 'var(--teal)' : 'rgba(74,155,142,0.18)'}`,
                                borderRadius: '9px', cursor: 'pointer',
                                fontSize: '13px', fontWeight: '600',
                                color: selected.code === course.code ? 'white' : 'var(--text-mid)',
                                transition: 'all 0.15s',
                            }}
                        >
                            {course.code}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

                    {/* Left — topic list */}
                    <div style={{
                        background: 'var(--off-white)', borderRadius: '14px',
                        padding: '24px 28px',
                        border: '1px solid rgba(74,155,142,0.1)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 3px' }}>
                                    {selected.name}
                                </h2>
                                <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                                    {selected.code} — {selected.university}
                                </p>
                            </div>
                            <span style={{
                                fontSize: '11px', fontWeight: '600', color: 'var(--text-light)',
                                background: 'var(--eggshell)', borderRadius: '6px',
                                padding: '4px 10px',
                            }}>
                                Based on {selected.topics[0]?.outOf || 0} past papers
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected.code}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {selected.topics.map((topic, i) => (
                                    <TopicRow key={topic.name} topic={topic} index={i} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right — summary cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                        {/* Legend */}
                        <div style={{
                            background: 'var(--off-white)', borderRadius: '14px',
                            padding: '20px', border: '1px solid rgba(74,155,142,0.1)',
                        }}>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '14px' }}>
                                How to read this
                            </p>
                            {[
                                { label: 'Very likely', desc: 'Appeared in 80%+ of papers', color: '#0F6E56', bg: '#E1F5EE' },
                                { label: 'Likely', desc: 'Appeared in 60–79% of papers', color: '#4A9B8E', bg: '#EAF5F3' },
                                { label: 'Possible', desc: 'Appeared in 40–59% of papers', color: '#C87A00', bg: '#FFF4E6' },
                                { label: 'Unlikely', desc: 'Appeared in under 40%', color: '#8A8A8A', bg: '#F1EFE8' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '700',
                                        color: item.color, background: item.bg,
                                        borderRadius: '5px', padding: '2px 7px',
                                        whiteSpace: 'nowrap', marginTop: '1px',
                                    }}>
                                        {item.label}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: 1.4 }}>
                                        {item.desc}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Must study */}
                        {topTopics.length > 0 && (
                            <div style={{
                                background: '#E1F5EE', borderRadius: '14px',
                                padding: '20px', border: '1px solid rgba(15,110,86,0.15)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                                    <CheckCircle size={15} color="#0F6E56" />
                                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F6E56', margin: 0 }}>
                                        Must study
                                    </p>
                                </div>
                                {topTopics.map(t => (
                                    <p key={t.name} style={{
                                        fontSize: '12px', color: '#0F6E56',
                                        marginBottom: '6px', paddingLeft: '4px',
                                        lineHeight: 1.4,
                                    }}>
                                        {t.name}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Worth reviewing */}
                        {likelyTopics.length > 0 && (
                            <div style={{
                                background: '#FFF4E6', borderRadius: '14px',
                                padding: '20px', border: '1px solid rgba(200,122,0,0.15)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                                    <AlertCircle size={15} color="#C87A00" />
                                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#C87A00', margin: 0 }}>
                                        Worth reviewing
                                    </p>
                                </div>
                                {likelyTopics.map(t => (
                                    <p key={t.name} style={{
                                        fontSize: '12px', color: '#956200',
                                        marginBottom: '6px', paddingLeft: '4px',
                                        lineHeight: 1.4,
                                    }}>
                                        {t.name}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Ask AI */}
                        <Link href="/ai" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--teal)', borderRadius: '14px',
                                padding: '18px 20px', cursor: 'pointer',
                            }}>
                                <p style={{ fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                                    Ask Mkato AI
                                </p>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                                    Get a detailed explanation of any topic in this list.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

