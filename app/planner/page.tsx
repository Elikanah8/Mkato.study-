'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Trash2, CheckCircle, Circle, Calendar, Clock, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Exam = {
    id: string
    course: string
    code: string
    date: string
    time: string
}

type Task = {
    id: string
    text: string
    done: boolean
    examId: string
    date: string
}

const NAV = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Find Papers', href: '/papers' },
    { label: 'Mkato AI', href: '/ai' },
    { label: 'Upload Paper', href: '/upload' },
    { label: 'Flashcards', href: '/flashcards' },
    { label: 'Pass Predictor', href: '/predictor' },
    { label: 'Study Planner', href: '/planner', active: true },
    { label: 'My Notes', href: '/notes' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysUntil(dateStr: string): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const exam = new Date(dateStr)
    exam.setHours(0, 0, 0, 0)
    return Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function urgencyColor(days: number) {
    if (days <= 3) return { text: '#791F1F', bg: '#FCEBEB', border: 'rgba(226,75,74,0.2)' }
    if (days <= 7) return { text: '#C87A00', bg: '#FFF4E6', border: 'rgba(200,122,0,0.2)' }
    return { text: '#0F6E56', bg: '#E1F5EE', border: 'rgba(15,110,86,0.2)' }
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-KE', {
        weekday: 'short', day: 'numeric', month: 'short',
    })
}

// ─── Exam card ────────────────────────────────────────────────────────────────
function ExamCard({
    exam, tasks, onAddTask, onToggleTask, onDeleteTask, onDeleteExam,
}: {
    exam: Exam
    tasks: Task[]
    onAddTask: (examId: string, text: string) => void
    onToggleTask: (taskId: string) => void
    onDeleteTask: (taskId: string) => void
    onDeleteExam: (examId: string) => void
}) {
    const [newTask, setNewTask] = useState('')
    const days = daysUntil(exam.date)
    const urgency = urgencyColor(days)
    const examTasks = tasks.filter(t => t.examId === exam.id)
    const done = examTasks.filter(t => t.done).length
    const progress = examTasks.length > 0 ? Math.round((done / examTasks.length) * 100) : 0

    function handleAddTask() {
        if (!newTask.trim()) return
        onAddTask(exam.id, newTask.trim())
        setNewTask('')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'var(--off-white)', borderRadius: '14px',
                border: '1px solid rgba(74,155,142,0.1)',
                overflow: 'hidden', marginBottom: '16px',
            }}
        >
            {/* Card header */}
            <div style={{
                padding: '18px 20px',
                borderBottom: '1px solid rgba(74,155,142,0.08)',
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', gap: '12px',
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
                            {exam.course}
                        </h3>
                        <span style={{
                            fontSize: '11px', fontWeight: '600',
                            color: 'var(--teal)', background: 'var(--teal-light)',
                            borderRadius: '5px', padding: '2px 8px',
                        }}>
                            {exam.code}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={12} color="var(--text-light)" />
                            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                {formatDate(exam.date)}
                            </span>
                        </div>
                        {exam.time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={12} color="var(--text-light)" />
                                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                    {exam.time}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Days badge */}
                    <div style={{
                        background: urgency.bg, border: `1px solid ${urgency.border}`,
                        borderRadius: '8px', padding: '6px 12px', textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '18px', fontWeight: '800', color: urgency.text, margin: 0, lineHeight: 1 }}>
                            {days < 0 ? '—' : days}
                        </p>
                        <p style={{ fontSize: '10px', color: urgency.text, margin: 0, opacity: 0.8 }}>
                            {days < 0 ? 'passed' : days === 0 ? 'today' : days === 1 ? 'day left' : 'days left'}
                        </p>
                    </div>

                    {/* Delete exam */}
                    <button
                        onClick={() => onDeleteExam(exam.id)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '4px', opacity: 0.4,
                            transition: 'opacity 0.15s', display: 'flex',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.4'}
                    >
                        <Trash2 size={14} color="#791F1F" />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            {examTasks.length > 0 && (
                <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(74,155,142,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                            Study progress
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--teal)' }}>
                            {done}/{examTasks.length} tasks done
                        </span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--eggshell)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                            style={{
                                height: '100%', borderRadius: '2px',
                                background: progress === 100 ? '#0F6E56' : 'var(--teal)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Tasks */}
            <div style={{ padding: '12px 20px 16px' }}>
                <AnimatePresence>
                    {examTasks.map(task => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                display: 'flex', alignItems: 'center',
                                gap: '10px', padding: '7px 0',
                                borderBottom: '1px solid rgba(74,155,142,0.06)',
                            }}
                        >
                            <button
                                onClick={() => onToggleTask(task.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}
                            >
                                {task.done
                                    ? <CheckCircle size={16} color="var(--teal)" />
                                    : <Circle size={16} color="var(--text-light)" />
                                }
                            </button>
                            <span style={{
                                fontSize: '13px', flex: 1,
                                color: task.done ? 'var(--text-light)' : 'var(--text-dark)',
                                textDecoration: task.done ? 'line-through' : 'none',
                                transition: 'all 0.2s',
                            }}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => onDeleteTask(task.id)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '2px', opacity: 0,
                                    transition: 'opacity 0.15s', display: 'flex',
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0'}
                            >
                                <Trash2 size={12} color="var(--text-light)" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add task input */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                        placeholder="Add a study task..."
                        style={{
                            flex: 1, padding: '8px 12px',
                            background: 'var(--eggshell)',
                            border: '1.5px solid rgba(74,155,142,0.15)',
                            borderRadius: '8px', fontSize: '13px',
                            color: 'var(--text-dark)', outline: 'none',
                            fontFamily: 'inherit',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.15)'}
                    />
                    <button
                        onClick={handleAddTask}
                        style={{
                            padding: '8px 14px', background: 'var(--teal)',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: '600', color: 'white',
                            display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PlannerPage() {
    const [exams, setExams] = useState<Exam[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [showForm, setShowForm] = useState(false)

    const [course, setCourse] = useState('')
    const [code, setCode] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [error, setError] = useState('')

    // Load from localStorage
    useEffect(() => {
        const savedExams = localStorage.getItem('mkato_exams')
        const savedTasks = localStorage.getItem('mkato_tasks')
        if (savedExams) setExams(JSON.parse(savedExams))
        if (savedTasks) setTasks(JSON.parse(savedTasks))
    }, [])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('mkato_exams', JSON.stringify(exams))
    }, [exams])

    useEffect(() => {
        localStorage.setItem('mkato_tasks', JSON.stringify(tasks))
    }, [tasks])

    function addExam() {
        if (!course.trim() || !date) {
            setError('Course name and exam date are required.')
            return
        }
        const newExam: Exam = {
            id: Date.now().toString(),
            course: course.trim(),
            code: code.trim().toUpperCase(),
            date,
            time,
        }
        setExams(prev => [...prev, newExam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
        setCourse(''); setCode(''); setDate(''); setTime(''); setError('')
        setShowForm(false)
    }

    function deleteExam(examId: string) {
        setExams(prev => prev.filter(e => e.id !== examId))
        setTasks(prev => prev.filter(t => t.examId !== examId))
    }

    function addTask(examId: string, text: string) {
        const newTask: Task = {
            id: Date.now().toString(),
            text, examId, done: false,
            date: new Date().toISOString(),
        }
        setTasks(prev => [...prev, newTask])
    }

    function toggleTask(taskId: string) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t))
    }

    function deleteTask(taskId: string) {
        setTasks(prev => prev.filter(t => t.id !== taskId))
    }

    const upcomingExams = exams.filter(e => daysUntil(e.date) >= 0)
    const pastExams = exams.filter(e => daysUntil(e.date) < 0)
    const nextExam = upcomingExams[0]

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px',
        background: 'var(--eggshell)',
        border: '1.5px solid rgba(74,155,142,0.18)',
        borderRadius: '9px', fontSize: '13px',
        color: 'var(--text-dark)', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.15s',
    }

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
            <main style={{ marginLeft: '220px', flex: 1, padding: '36px 40px', maxWidth: 'calc(100vw - 220px)' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <Link href="/dashboard" style={{
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                            gap: '4px', fontSize: '13px', color: 'var(--text-light)', marginBottom: '12px',
                        }}>
                            <ChevronLeft size={14} /> Dashboard
                        </Link>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                            Study Planner
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                            Add your exams and track your study tasks.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            padding: '10px 18px', background: 'var(--teal)',
                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: '600', color: 'white',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        <Plus size={15} /> Add exam
                    </button>
                </div>

                {/* Add exam form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '24px' }}
                        >
                            <div style={{
                                background: 'var(--off-white)', borderRadius: '14px',
                                padding: '24px', border: '1px solid rgba(74,155,142,0.12)',
                            }}>
                                <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '18px' }}>
                                    Add an exam
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '5px' }}>
                                            Course name <span style={{ color: 'var(--teal)' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={course}
                                            onChange={e => setCourse(e.target.value)}
                                            placeholder="e.g. Financial Accounting"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '5px' }}>
                                            Course code
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            placeholder="e.g. BCOM 202"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '5px' }}>
                                            Exam date <span style={{ color: 'var(--teal)' }}>*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '5px' }}>
                                            Exam time
                                        </label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={e => setTime(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        background: '#FCEBEB', borderRadius: '8px',
                                        padding: '9px 12px', marginBottom: '12px',
                                    }}>
                                        <AlertCircle size={13} color="#791F1F" />
                                        <span style={{ fontSize: '12px', color: '#791F1F' }}>{error}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={addExam}
                                        style={{
                                            padding: '10px 20px', background: 'var(--teal)',
                                            border: 'none', borderRadius: '9px', cursor: 'pointer',
                                            fontSize: '13px', fontWeight: '600', color: 'white',
                                        }}
                                    >
                                        Add exam
                                    </button>
                                    <button
                                        onClick={() => { setShowForm(false); setError('') }}
                                        style={{
                                            padding: '10px 20px', background: 'transparent',
                                            border: '1.5px solid rgba(74,155,142,0.2)',
                                            borderRadius: '9px', cursor: 'pointer',
                                            fontSize: '13px', fontWeight: '500', color: 'var(--text-mid)',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Next exam banner */}
                {nextExam && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'var(--teal)', borderRadius: '14px',
                            padding: '18px 24px', marginBottom: '24px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                        }}
                    >
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '3px', letterSpacing: '0.05em' }}>
                                NEXT EXAM
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: '0 0 2px' }}>
                                {nextExam.course}
                            </p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                {formatDate(nextExam.date)}{nextExam.time ? ` at ${nextExam.time}` : ''}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '36px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1 }}>
                                {daysUntil(nextExam.date)}
                            </p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                days to go
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Empty state */}
                {exams.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center', padding: '80px 24px',
                            background: 'var(--off-white)', borderRadius: '16px',
                            border: '1px dashed rgba(74,155,142,0.2)',
                        }}
                    >
                        <Calendar size={36} color="rgba(74,155,142,0.25)" style={{ marginBottom: '14px' }} />
                        <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '6px' }}>
                            No exams added yet
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>
                            Add your exam timetable and start tracking your study tasks.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                background: 'var(--teal)', color: 'white',
                                border: 'none', borderRadius: '9px',
                                padding: '10px 22px', fontSize: '13px',
                                fontWeight: '600', cursor: 'pointer',
                            }}
                        >
                            Add your first exam
                        </button>
                    </motion.div>
                )}

                {/* Upcoming exams */}
                {upcomingExams.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                            Upcoming — {upcomingExams.length} exam{upcomingExams.length !== 1 ? 's' : ''}
                        </p>
                        {upcomingExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                exam={exam}
                                tasks={tasks}
                                onAddTask={addTask}
                                onToggleTask={toggleTask}
                                onDeleteTask={deleteTask}
                                onDeleteExam={deleteExam}
                            />
                        ))}
                    </div>
                )}

                {/* Past exams */}
                {pastExams.length > 0 && (
                    <div>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-light)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                            Past exams
                        </p>
                        {pastExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                exam={exam}
                                tasks={tasks}
                                onAddTask={addTask}
                                onToggleTask={toggleTask}
                                onDeleteTask={deleteTask}
                                onDeleteExam={deleteExam}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

