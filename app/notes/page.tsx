'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Plus, Trash2, Search, X, FileText, Save } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Note = {
    id: string
    title: string
    content: string
    course: string
    createdAt: string
    updatedAt: string
}

const NAV = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Find Papers', href: '/papers' },
    { label: 'Mkato AI', href: '/ai' },
    { label: 'Upload Paper', href: '/upload' },
    { label: 'Flashcards', href: '/flashcards' },
    { label: 'Pass Predictor', href: '/predictor' },
    { label: 'Study Planner', href: '/planner' },
    { label: 'My Notes', href: '/notes', active: true },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-KE', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([])
    const [selected, setSelected] = useState<Note | null>(null)
    const [search, setSearch] = useState('')
    const [saved, setSaved] = useState(true)
    const [showNew, setShowNew] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newCourse, setNewCourse] = useState('')
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const saveTimer = useRef<NodeJS.Timeout | undefined>(undefined)

    // Load notes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mkato_notes')
        if (saved) {
            const parsed = JSON.parse(saved)
            setNotes(parsed)
            if (parsed.length > 0) setSelected(parsed[0])
        }
    }, [])

    // Save notes to localStorage
    function persistNotes(updated: Note[]) {
        setNotes(updated)
        localStorage.setItem('mkato_notes', JSON.stringify(updated))
    }

    // Auto-save on content change
    function handleContentChange(value: string) {
        if (!selected) return
        setSaved(false)
        clearTimeout(saveTimer.current)

        const updated = notes.map(n =>
            n.id === selected.id
                ? { ...n, content: value, updatedAt: new Date().toISOString() }
                : n
        )
        const updatedNote = updated.find(n => n.id === selected.id)!
        setSelected(updatedNote)

        saveTimer.current = setTimeout(() => {
            persistNotes(updated)
            setSaved(true)
        }, 800)
    }

    function handleTitleChange(value: string) {
        if (!selected) return
        const updated = notes.map(n =>
            n.id === selected.id
                ? { ...n, title: value, updatedAt: new Date().toISOString() }
                : n
        )
        const updatedNote = updated.find(n => n.id === selected.id)!
        setSelected(updatedNote)
        persistNotes(updated)
    }

    function createNote() {
        if (!newTitle.trim()) return
        const note: Note = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            content: '',
            course: newCourse.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        const updated = [note, ...notes]
        persistNotes(updated)
        setSelected(note)
        setNewTitle('')
        setNewCourse('')
        setShowNew(false)
        setTimeout(() => contentRef.current?.focus(), 100)
    }

    function deleteNote(id: string) {
        const updated = notes.filter(n => n.id !== id)
        persistNotes(updated)
        setSelected(updated.length > 0 ? updated[0] : null)
    }

    const filtered = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.course.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )

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

            {/* Notes layout */}
            <div style={{ marginLeft: '220px', flex: 1, display: 'flex', height: '100vh', overflow: 'hidden' }}>

                {/* Notes list panel */}
                <div style={{
                    width: '280px', flexShrink: 0,
                    background: 'var(--off-white)',
                    borderRight: '1px solid rgba(74,155,142,0.1)',
                    display: 'flex', flexDirection: 'column',
                    height: '100vh', overflow: 'hidden',
                }}>
                    {/* Panel header */}
                    <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(74,155,142,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
                                My Notes
                            </h1>
                            <button
                                onClick={() => setShowNew(true)}
                                style={{
                                    width: '30px', height: '30px',
                                    background: 'var(--teal)', border: 'none',
                                    borderRadius: '8px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <Plus size={15} color="white" />
                            </button>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={13} color="var(--text-light)" style={{
                                position: 'absolute', left: '10px',
                                top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
                            }} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search notes..."
                                style={{
                                    width: '100%', padding: '8px 10px 8px 30px',
                                    background: 'var(--eggshell)',
                                    border: '1.5px solid rgba(74,155,142,0.15)',
                                    borderRadius: '8px', fontSize: '12px',
                                    color: 'var(--text-dark)', outline: 'none',
                                    boxSizing: 'border-box', fontFamily: 'inherit',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.15)'}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{
                                        position: 'absolute', right: '8px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', padding: '2px',
                                        display: 'flex',
                                    }}
                                >
                                    <X size={12} color="var(--text-light)" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* New note form */}
                    <AnimatePresence>
                        {showNew && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    overflow: 'hidden',
                                    borderBottom: '1px solid rgba(74,155,142,0.08)',
                                }}
                            >
                                <div style={{ padding: '12px 16px', background: 'var(--teal-light)' }}>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && createNote()}
                                        placeholder="Note title"
                                        autoFocus
                                        style={{
                                            width: '100%', padding: '8px 10px',
                                            background: 'white',
                                            border: '1.5px solid rgba(74,155,142,0.2)',
                                            borderRadius: '7px', fontSize: '13px',
                                            color: 'var(--text-dark)', outline: 'none',
                                            boxSizing: 'border-box', fontFamily: 'inherit',
                                            marginBottom: '8px',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={newCourse}
                                        onChange={e => setNewCourse(e.target.value)}
                                        placeholder="Course (optional)"
                                        style={{
                                            width: '100%', padding: '8px 10px',
                                            background: 'white',
                                            border: '1.5px solid rgba(74,155,142,0.2)',
                                            borderRadius: '7px', fontSize: '12px',
                                            color: 'var(--text-dark)', outline: 'none',
                                            boxSizing: 'border-box', fontFamily: 'inherit',
                                            marginBottom: '8px',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button
                                            onClick={createNote}
                                            style={{
                                                flex: 1, padding: '7px',
                                                background: 'var(--teal)', border: 'none',
                                                borderRadius: '7px', cursor: 'pointer',
                                                fontSize: '12px', fontWeight: '600', color: 'white',
                                            }}
                                        >
                                            Create
                                        </button>
                                        <button
                                            onClick={() => { setShowNew(false); setNewTitle(''); setNewCourse('') }}
                                            style={{
                                                padding: '7px 10px',
                                                background: 'transparent',
                                                border: '1px solid rgba(74,155,142,0.2)',
                                                borderRadius: '7px', cursor: 'pointer',
                                                fontSize: '12px', color: 'var(--text-mid)',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notes list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                                <FileText size={28} color="rgba(74,155,142,0.2)" style={{ marginBottom: '10px' }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: 1.5 }}>
                                    {notes.length === 0 ? 'No notes yet. Create your first note.' : 'No notes match your search.'}
                                </p>
                            </div>
                        ) : (
                            filtered.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => setSelected(note)}
                                    style={{
                                        padding: '14px 16px',
                                        borderBottom: '1px solid rgba(74,155,142,0.06)',
                                        cursor: 'pointer',
                                        background: selected?.id === note.id ? 'var(--teal-light)' : 'transparent',
                                        transition: 'background 0.15s',
                                        position: 'relative',
                                    }}
                                    onMouseEnter={e => {
                                        if (selected?.id !== note.id)
                                            (e.currentTarget as HTMLDivElement).style.background = 'var(--eggshell)'
                                    }}
                                    onMouseLeave={e => {
                                        if (selected?.id !== note.id)
                                            (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                                    }}
                                >
                                    <p style={{
                                        fontSize: '13px', fontWeight: '600',
                                        color: selected?.id === note.id ? 'var(--teal)' : 'var(--text-dark)',
                                        marginBottom: '3px',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        paddingRight: '20px',
                                    }}>
                                        {note.title}
                                    </p>
                                    {note.course && (
                                        <p style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: '500', marginBottom: '3px' }}>
                                            {note.course}
                                        </p>
                                    )}
                                    <p style={{
                                        fontSize: '11px', color: 'var(--text-light)',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {note.content ? note.content.slice(0, 60) + (note.content.length > 60 ? '...' : '') : 'Empty note'}
                                    </p>
                                    <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>
                                        {formatDate(note.updatedAt)}
                                    </p>

                                    {/* Delete button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                                        style={{
                                            position: 'absolute', top: '12px', right: '10px',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            padding: '2px', opacity: 0, transition: 'opacity 0.15s',
                                            display: 'flex',
                                        }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0'}
                                    >
                                        <Trash2 size={12} color="#791F1F" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '10px 16px',
                        borderTop: '1px solid rgba(74,155,142,0.08)',
                        fontSize: '11px', color: 'var(--text-light)',
                    }}>
                        {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Editor panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                    {selected ? (
                        <>
                            {/* Editor top bar */}
                            <div style={{
                                padding: '14px 28px',
                                background: 'var(--off-white)',
                                borderBottom: '1px solid rgba(74,155,142,0.08)',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', gap: '12px',
                                flexShrink: 0,
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <input
                                        type="text"
                                        value={selected.title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        style={{
                                            width: '100%', background: 'none', border: 'none',
                                            outline: 'none', fontSize: '18px', fontWeight: '700',
                                            color: 'var(--text-dark)', fontFamily: 'inherit',
                                            padding: 0,
                                        }}
                                    />
                                    {selected.course && (
                                        <p style={{ fontSize: '12px', color: 'var(--teal)', margin: '3px 0 0', fontWeight: '500' }}>
                                            {selected.course}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                                        {wordCount(selected.content)} words
                                    </span>
                                    <span style={{
                                        fontSize: '11px', fontWeight: '500',
                                        color: saved ? 'var(--teal)' : 'var(--text-light)',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                        <Save size={11} />
                                        {saved ? 'Saved' : 'Saving...'}
                                    </span>
                                </div>
                            </div>

                            {/* Editor area */}
                            <textarea
                                ref={contentRef}
                                value={selected.content}
                                onChange={e => handleContentChange(e.target.value)}
                                placeholder="Start writing your notes here...

Tips:
• Use headers to organize topics
• Write in your own words — it helps you remember
• Add key definitions and formulas
• Note down likely exam questions"
                                style={{
                                    flex: 1, padding: '28px',
                                    background: 'var(--eggshell)',
                                    border: 'none', outline: 'none',
                                    fontSize: '14px', lineHeight: 1.8,
                                    color: 'var(--text-dark)', resize: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />

                            {/* Bottom bar */}
                            <div style={{
                                padding: '10px 28px',
                                background: 'var(--off-white)',
                                borderTop: '1px solid rgba(74,155,142,0.08)',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '11px', color: 'var(--text-light)',
                                flexShrink: 0,
                            }}>
                                <span>Last updated {formatDate(selected.updatedAt)}</span>
                                <Link href="/ai" style={{
                                    textDecoration: 'none', fontSize: '12px',
                                    color: 'var(--teal)', fontWeight: '600',
                                }}>
                                    Ask Mkato AI to improve these notes
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* No note selected */
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexDirection: 'column',
                            gap: '12px', padding: '40px',
                        }}>
                            <FileText size={40} color="rgba(74,155,142,0.2)" />
                            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-mid)' }}>
                                No note selected
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                                Select a note from the list or create a new one.
                            </p>
                            <button
                                onClick={() => setShowNew(true)}
                                style={{
                                    padding: '10px 20px', background: 'var(--teal)',
                                    border: 'none', borderRadius: '9px', cursor: 'pointer',
                                    fontSize: '13px', fontWeight: '600', color: 'white',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}
                            >
                                <Plus size={14} /> New note
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

