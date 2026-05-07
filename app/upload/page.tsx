'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, ChevronLeft, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

// ─── Constants ────────────────────────────────────────────────────────────────
const UNIVERSITIES = [
    'University of Nairobi',
    'Kenyatta University',
    'JKUAT',
    'KCA University',
    'Strathmore University',
    'USIU Africa',
    'Moi University',
    'Egerton University',
]

const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

const NAV = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Find Papers', href: '/papers' },
    { label: 'Mkato AI', href: '/ai' },
    { label: 'Upload Paper', href: '/upload', active: true },
    { label: 'Flashcards', href: '/flashcards' },
    { label: 'Pass Predictor', href: '/predictor' },
    { label: 'Study Planner', href: '/planner' },
    { label: 'My Notes', href: '/notes' },
]

// ─── Input component ──────────────────────────────────────────────────────────
function Field({
    label, required, children, hint,
}: {
    label: string
    required?: boolean
    children: React.ReactNode
    hint?: string
}) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'block', fontSize: '13px',
                fontWeight: '600', color: 'var(--text-dark)',
                marginBottom: '6px',
            }}>
                {label}
                {required && <span style={{ color: 'var(--teal)', marginLeft: '3px' }}>*</span>}
            </label>
            {children}
            {hint && (
                <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '5px' }}>
                    {hint}
                </p>
            )}
        </div>
    )
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--eggshell)',
    border: '1.5px solid rgba(74,155,142,0.18)',
    borderRadius: '9px',
    fontSize: '13px',
    color: 'var(--text-dark)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)

    const [title, setTitle] = useState('')
    const [university, setUniversity] = useState('')
    const [courseName, setCourseName] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const [year, setYear] = useState('')

    const supabase = createClient()

    // ── Drag and drop ───────────────────────────────────────────────────────────
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped) validateAndSetFile(dropped)
    }, [])

    function validateAndSetFile(f: File) {
        setError('')
        if (f.type !== 'application/pdf') {
            setError('Only PDF files are accepted.')
            return
        }
        if (f.size > 10 * 1024 * 1024) {
            setError('File size must be under 10MB.')
            return
        }
        setFile(f)
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (f) validateAndSetFile(f)
    }

    // ── Upload ──────────────────────────────────────────────────────────────────
    async function handleUpload() {
        if (!file || !title || !university || !courseName || !courseCode || !year) {
            setError('Please fill in all required fields and select a file.')
            return
        }

        setUploading(true)
        setError('')
        setProgress(0)

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('You must be logged in to upload papers.')
                setUploading(false)
                return
            }

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 85) { clearInterval(progressInterval); return prev }
                    return prev + 15
                })
            }, 300)

            // Upload file to Supabase storage
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
            const { data: storageData, error: storageError } = await supabase.storage
                .from('papers')
                .upload(fileName, file, { contentType: 'application/pdf' })

            clearInterval(progressInterval)

            if (storageError) throw storageError

            setProgress(90)

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('papers')
                .getPublicUrl(fileName)

            // Save paper record to database
            const { error: dbError } = await supabase
                .from('papers')
                .insert({
                    title,
                    university,
                    course_name: courseName,
                    course_code: courseCode,
                    year: parseInt(year),
                    file_url: publicUrl,
                    file_size: file.size,
                    uploaded_by: user.id,
                    is_approved: false,
                    is_premium: false,
                })

            if (dbError) throw dbError

            setProgress(100)
            setSuccess(true)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    function resetForm() {
        setFile(null)
        setTitle('')
        setUniversity('')
        setCourseName('')
        setCourseCode('')
        setYear('')
        setSuccess(false)
        setError('')
        setProgress(0)
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

                {/* Earn points notice */}
                <div style={{
                    background: 'var(--teal-light)',
                    borderRadius: '10px', padding: '14px',
                    border: '1px solid rgba(74,155,142,0.2)',
                }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--teal)', marginBottom: '4px' }}>
                        Earn free premium
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--teal)', lineHeight: 1.5, opacity: 0.8 }}>
                        Upload an approved paper and get 7 days of free premium access.
                    </p>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: '220px', flex: 1, padding: '36px 40px', maxWidth: '800px' }}>

                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <Link href="/dashboard" style={{
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                        gap: '4px', fontSize: '13px', color: 'var(--text-light)', marginBottom: '12px',
                    }}>
                        <ChevronLeft size={14} /> Dashboard
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                        Upload a Past Paper
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                        Help other students and earn 7 days of free premium access when your paper is approved.
                    </p>
                </div>

                <AnimatePresence mode="wait">

                    {/* Success state */}
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: 'var(--off-white)', borderRadius: '16px',
                                padding: '60px 40px', textAlign: 'center',
                                border: '1px solid rgba(74,155,142,0.15)',
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

                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
                                Paper submitted successfully
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '6px', lineHeight: 1.6 }}>
                                Your paper is under review. Once approved it will appear in the library and you will receive 7 days of free premium access.
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '32px' }}>
                                Review usually takes 24-48 hours.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={resetForm}
                                    style={{
                                        padding: '11px 24px', background: 'var(--teal)',
                                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                                        fontSize: '14px', fontWeight: '600', color: 'white',
                                    }}
                                >
                                    Upload another paper
                                </button>
                                <Link href="/papers" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '11px 24px', background: 'transparent',
                                        border: '1.5px solid rgba(74,155,142,0.25)',
                                        borderRadius: '10px', cursor: 'pointer',
                                        fontSize: '14px', fontWeight: '600', color: 'var(--text-mid)',
                                    }}>
                                        Browse papers
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                    ) : (

                        /* Upload form */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Drop zone */}
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => !file && document.getElementById('file-input')?.click()}
                                style={{
                                    border: `2px dashed ${dragOver ? 'var(--teal)' : file ? 'var(--teal)' : 'rgba(74,155,142,0.25)'}`,
                                    borderRadius: '14px',
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    background: dragOver ? 'var(--teal-light)' : file ? 'var(--teal-light)' : 'var(--off-white)',
                                    cursor: file ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    marginBottom: '28px',
                                }}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />

                                {file ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '10px',
                                            background: 'var(--teal)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <FileText size={22} color="white" />
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '3px' }}>
                                                {file.name}
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); setFile(null) }}
                                            style={{
                                                background: 'none', border: 'none',
                                                cursor: 'pointer', padding: '4px',
                                                marginLeft: '8px',
                                                display: 'flex', alignItems: 'center',
                                            }}
                                        >
                                            <X size={16} color="var(--text-mid)" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: 'var(--teal-light)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 14px',
                                        }}>
                                            <Upload size={22} color="var(--teal)" />
                                        </div>
                                        <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>
                                            Drop your PDF here or click to browse
                                        </p>
                                        <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                                            PDF files only — maximum 10MB
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Form fields */}
                            <div style={{
                                background: 'var(--off-white)', borderRadius: '14px',
                                padding: '28px', border: '1px solid rgba(74,155,142,0.1)',
                            }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '20px' }}>
                                    Paper details
                                </h2>

                                <Field label="Paper title" required hint="e.g. Introduction to Microeconomics">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Enter the full paper title"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                    />
                                </Field>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <Field label="University" required>
                                        <select
                                            value={university}
                                            onChange={e => setUniversity(e.target.value)}
                                            style={{
                                                ...inputStyle,
                                                appearance: 'none',
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                paddingRight: '32px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <option value="">Select university</option>
                                            {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </Field>

                                    <Field label="Year" required>
                                        <select
                                            value={year}
                                            onChange={e => setYear(e.target.value)}
                                            style={{
                                                ...inputStyle,
                                                appearance: 'none',
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                paddingRight: '32px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <option value="">Select year</option>
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </Field>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <Field label="Course name" required hint="e.g. Financial Accounting">
                                        <input
                                            type="text"
                                            value={courseName}
                                            onChange={e => setCourseName(e.target.value)}
                                            placeholder="Full course name"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </Field>

                                    <Field label="Course code" required hint="e.g. BCOM 202">
                                        <input
                                            type="text"
                                            value={courseCode}
                                            onChange={e => setCourseCode(e.target.value.toUpperCase())}
                                            placeholder="e.g. BCOM 202"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
                                        />
                                    </Field>
                                </div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                background: '#FCEBEB',
                                                border: '1px solid rgba(226,75,74,0.2)',
                                                borderRadius: '9px', padding: '11px 14px',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <AlertCircle size={15} color="#791F1F" />
                                            <p style={{ fontSize: '13px', color: '#791F1F', margin: 0 }}>{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Progress bar */}
                                <AnimatePresence>
                                    {uploading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ marginBottom: '16px' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--text-mid)', fontWeight: '500' }}>
                                                    Uploading...
                                                </span>
                                                <span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: '600' }}>
                                                    {progress}%
                                                </span>
                                            </div>
                                            <div style={{ height: '6px', background: 'var(--eggshell)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <motion.div
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{ height: '100%', background: 'var(--teal)', borderRadius: '3px' }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit button */}
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    style={{
                                        width: '100%', padding: '13px',
                                        background: uploading ? 'rgba(74,155,142,0.5)' : 'var(--teal)',
                                        border: 'none', borderRadius: '10px',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px', fontWeight: '700', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {uploading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                                                style={{
                                                    width: '15px', height: '15px',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTop: '2px solid white', borderRadius: '50%',
                                                }}
                                            />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={15} />
                                            Submit Paper
                                        </>
                                    )}
                                </button>

                                <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '10px', lineHeight: 1.5 }}>
                                    Papers are reviewed before being made public. You will be notified once approved.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

