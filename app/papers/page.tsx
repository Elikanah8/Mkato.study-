'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Search, Filter, Download, Eye, BookOpen,
  ChevronLeft, Star, Lock, FileText, X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Paper = {
  id: string
  title: string
  university: string
  course: string
  year: string
  downloads: number
  pages: number
  isPremium: boolean
}

// ─── Sample data (will be replaced with Supabase data in Part A) ──────────────
const SAMPLE_PAPERS: Paper[] = [
  { id: '1', title: 'Introduction to Economics', university: 'University of Nairobi', course: 'BCOM 201', year: '2023', downloads: 1240, pages: 4, isPremium: false },
  { id: '2', title: 'Financial Accounting', university: 'University of Nairobi', course: 'BCOM 202', year: '2023', downloads: 980, pages: 6, isPremium: false },
  { id: '3', title: 'Business Law', university: 'University of Nairobi', course: 'BCOM 203', year: '2022', downloads: 750, pages: 5, isPremium: true },
  { id: '4', title: 'Calculus I', university: 'Kenyatta University', course: 'MATH 101', year: '2023', downloads: 1100, pages: 8, isPremium: false },
  { id: '5', title: 'Engineering Mathematics', university: 'JKUAT', course: 'MATH 112', year: '2023', downloads: 890, pages: 6, isPremium: false },
  { id: '6', title: 'Principles of Management', university: 'Strathmore University', course: 'BBA 101', year: '2022', downloads: 670, pages: 4, isPremium: true },
  { id: '7', title: 'Computer Networks', university: 'KCA University', course: 'CSC 301', year: '2023', downloads: 540, pages: 7, isPremium: false },
  { id: '8', title: 'Introduction to Law', university: 'USIU Africa', course: 'LAW 101', year: '2022', downloads: 430, pages: 5, isPremium: true },
  { id: '9', title: 'Microeconomics', university: 'Kenyatta University', course: 'ECON 201', year: '2021', downloads: 920, pages: 6, isPremium: false },
  { id: '10', title: 'Database Systems', university: 'JKUAT', course: 'CSC 212', year: '2023', downloads: 780, pages: 8, isPremium: false },
  { id: '11', title: 'Marketing Management', university: 'Strathmore University', course: 'MKT 201', year: '2022', downloads: 610, pages: 5, isPremium: true },
  { id: '12', title: 'Nursing Ethics', university: 'University of Nairobi', course: 'NUR 301', year: '2023', downloads: 480, pages: 4, isPremium: false },
]

const UNIVERSITIES = [
  'All Universities',
  'University of Nairobi',
  'Kenyatta University',
  'JKUAT',
  'KCA University',
  'Strathmore University',
  'USIU Africa',
  'Moi University',
  'Egerton University',
]

const YEARS = ['All Years', '2023', '2022', '2021', '2020', '2019', '2018']

// ─── Paper card ───────────────────────────────────────────────────────────────
function PaperCard({ paper, index }: { paper: Paper, index: number }) {
  const [downloading, setDownloading] = useState(false)

  function handleDownload() {
    if (paper.isPremium) return
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(74,155,142,0.12)' }}
      style={{
        background: 'var(--off-white)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(74,155,142,0.12)',
        transition: 'box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium badge */}
      {paper.isPremium && (
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: '#FAEEDA', borderRadius: '100px',
          padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <Lock size={10} color="#633806" />
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#633806' }}>Premium</span>
        </div>
      )}

      {/* Paper icon and title */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: paper.isPremium ? '#FAEEDA' : 'var(--teal-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <FileText size={20} color={paper.isPremium ? '#633806' : 'var(--teal)'} />
        </div>
        <div style={{ flex: 1, paddingRight: paper.isPremium ? '70px' : '0' }}>
          <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px', lineHeight: 1.3 }}>
            {paper.title}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: '600' }}>
            {paper.course}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div style={{
        display: 'flex', gap: '16px', marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <BookOpen size={12} color="var(--text-light)" />
          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{paper.university}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Star size={12} color="var(--text-light)" />
          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{paper.year}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Download size={12} color="var(--text-light)" />
          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{paper.downloads.toLocaleString()} downloads</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FileText size={12} color="var(--text-light)" />
          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{paper.pages} pages</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* View button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, padding: '10px',
            background: 'var(--eggshell)',
            border: '1px solid rgba(74,155,142,0.2)',
            borderRadius: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)',
          }}
        >
          <Eye size={14} />
          Preview
        </motion.button>

        {/* Download / Unlock button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          style={{
            flex: 1, padding: '10px',
            background: paper.isPremium ? '#FAEEDA' : 'var(--teal)',
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '600',
            color: paper.isPremium ? '#633806' : 'white',
          }}
        >
          {downloading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white', borderRadius: '50%',
              }}
            />
          ) : paper.isPremium ? (
            <><Lock size={14} /> Unlock</>
          ) : (
            <><Download size={14} /> Download</>
          )}
        </motion.button>

        {/* Ask AI button */}
        <motion.button
          whileHover={{ scale: 1.08, background: 'var(--blue-light)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '40px', height: '40px',
            background: 'var(--blue-light)',
            border: '1px solid rgba(91,127,166,0.2)',
            borderRadius: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Ask Mkato AI about this paper"
        >
          <Star size={15} color="var(--blue)" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PapersPage() {
  const [search, setSearch] = useState('')
  const [university, setUniversity] = useState('All Universities')
  const [year, setYear] = useState('All Years')
  const [showFilters, setShowFilters] = useState(false)

  // Filter logic
  const filtered = SAMPLE_PAPERS.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.course.toLowerCase().includes(search.toLowerCase()) ||
      p.university.toLowerCase().includes(search.toLowerCase())
    const matchUni = university === 'All Universities' || p.university === university
    const matchYear = year === 'All Years' || p.year === year
    return matchSearch && matchUni && matchYear
  })

  function clearFilters() {
    setSearch('')
    setUniversity('All Universities')
    setYear('All Years')
  }

  const hasFilters = search || university !== 'All Universities' || year !== 'All Years'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--eggshell)' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: '240px', minHeight: '100vh',
          background: 'var(--off-white)',
          borderRight: '1px solid rgba(74,155,142,0.12)',
          padding: '24px 16px',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50,
          display: 'flex', flexDirection: 'column',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
          <Image src="/mkato_study_logo.svg" alt="Mkato.study" width={32} height={32} />
          <span style={{ fontWeight: '800', fontSize: '17px', color: 'var(--teal)' }}>
            mkato<span style={{ color: 'var(--blue)' }}>.study</span>
          </span>
        </Link>

        {[
          { icon: '📊', label: 'Dashboard', href: '/dashboard' },
          { icon: '🔍', label: 'Find Papers', href: '/papers', active: true },
          { icon: '🤖', label: 'Mkato AI', href: '/ai' },
          { icon: '📤', label: 'Upload Paper', href: '/upload' },
          { icon: '⭐', label: 'Flashcards', href: '/flashcards' },
          { icon: '🎯', label: 'Pass Predictor', href: '/predictor' },
          { icon: '📅', label: 'Study Planner', href: '/planner' },
          { icon: '📝', label: 'My Notes', href: '/notes' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x: 4, background: 'var(--teal-light)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 16px', borderRadius: '10px', marginBottom: '4px',
                background: item.active ? 'var(--teal-light)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{
                fontSize: '14px', fontWeight: item.active ? '600' : '500',
                color: item.active ? 'var(--teal)' : 'var(--text-mid)',
              }}>
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: -3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-mid)', fontSize: '13px' }}
              >
                <ChevronLeft size={16} /> Dashboard
              </motion.div>
            </Link>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>
            Find Past Papers
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-mid)' }}>
            {SAMPLE_PAPERS.length} papers available • Search by course, university, or year
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-light)" style={{
              position: 'absolute', left: '16px',
              top: '50%', transform: 'translateY(-50%)',
            }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course name, unit code, or university..."
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                background: 'var(--off-white)',
                border: '1.5px solid rgba(74,155,142,0.2)',
                borderRadius: '14px', fontSize: '15px',
                color: 'var(--text-dark)', outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 2px 12px rgba(74,155,142,0.06)',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(74,155,142,0.2)'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: '16px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <X size={16} color="var(--text-light)" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex', gap: '12px', marginBottom: '24px',
            alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          {/* University filter */}
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'var(--off-white)',
              border: '1.5px solid rgba(74,155,142,0.2)',
              borderRadius: '10px', fontSize: '13px',
              color: 'var(--text-dark)', outline: 'none',
              cursor: 'pointer', fontWeight: '500',
            }}
          >
            {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
          </select>

          {/* Year filter */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'var(--off-white)',
              border: '1.5px solid rgba(74,155,142,0.2)',
              borderRadius: '10px', fontSize: '13px',
              color: 'var(--text-dark)', outline: 'none',
              cursor: 'pointer', fontWeight: '500',
            }}
          >
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>

          {/* Clear filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearFilters}
                whileHover={{ scale: 1.03 }}
                style={{
                  padding: '10px 16px',
                  background: '#FCEBEB',
                  border: '1px solid rgba(226,75,74,0.2)',
                  borderRadius: '10px', fontSize: '13px',
                  color: '#791F1F', cursor: 'pointer',
                  fontWeight: '600', display: 'flex',
                  alignItems: 'center', gap: '6px',
                }}
              >
                <X size={13} /> Clear filters
              </motion.button>
            )}
          </AnimatePresence>

          {/* Results count */}
          <span style={{ fontSize: '13px', color: 'var(--text-light)', marginLeft: 'auto' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Papers grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {filtered.map((paper, i) => (
                <PaperCard key={paper.id} paper={paper} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center', padding: '80px 24px',
                background: 'var(--off-white)', borderRadius: '20px',
                border: '1px dashed rgba(74,155,142,0.25)',
              }}
            >
              <Search size={48} color="rgba(74,155,142,0.3)" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-mid)', marginBottom: '8px' }}>
                No papers found
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '20px' }}>
                Try a different search or clear your filters
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={clearFilters}
                style={{
                  background: 'var(--teal)', color: 'white',
                  border: 'none', borderRadius: '10px',
                  padding: '10px 24px', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                Clear filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
