'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Search, Download, Eye, BookOpen, Lock, FileText, X, ChevronLeft, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

const SAMPLE_PAPERS: Paper[] = [
  { id: '1',  title: 'Introduction to Economics',   university: 'University of Nairobi',  course: 'BCOM 201', year: '2023', downloads: 1240, pages: 4, isPremium: false },
  { id: '2',  title: 'Financial Accounting',         university: 'University of Nairobi',  course: 'BCOM 202', year: '2023', downloads: 980,  pages: 6, isPremium: false },
  { id: '3',  title: 'Business Law',                 university: 'University of Nairobi',  course: 'BCOM 203', year: '2022', downloads: 750,  pages: 5, isPremium: true  },
  { id: '4',  title: 'Calculus I',                   university: 'Kenyatta University',    course: 'MATH 101', year: '2023', downloads: 1100, pages: 8, isPremium: false },
  { id: '5',  title: 'Engineering Mathematics',      university: 'JKUAT',                  course: 'MATH 112', year: '2023', downloads: 890,  pages: 6, isPremium: false },
  { id: '6',  title: 'Principles of Management',     university: 'Strathmore University',  course: 'BBA 101',  year: '2022', downloads: 670,  pages: 4, isPremium: true  },
  { id: '7',  title: 'Computer Networks',            university: 'KCA University',         course: 'CSC 301',  year: '2023', downloads: 540,  pages: 7, isPremium: false },
  { id: '8',  title: 'Introduction to Law',          university: 'USIU Africa',            course: 'LAW 101',  year: '2022', downloads: 430,  pages: 5, isPremium: true  },
  { id: '9',  title: 'Microeconomics',               university: 'Kenyatta University',    course: 'ECON 201', year: '2021', downloads: 920,  pages: 6, isPremium: false },
  { id: '10', title: 'Database Systems',             university: 'JKUAT',                  course: 'CSC 212',  year: '2023', downloads: 780,  pages: 8, isPremium: false },
  { id: '11', title: 'Marketing Management',         university: 'Strathmore University',  course: 'MKT 201',  year: '2022', downloads: 610,  pages: 5, isPremium: true  },
  { id: '12', title: 'Nursing Ethics',               university: 'University of Nairobi',  course: 'NUR 301',  year: '2023', downloads: 480,  pages: 4, isPremium: false },
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

const NAV = [
  { label: 'Dashboard',      href: '/dashboard' },
  { label: 'Find Papers',    href: '/papers',    active: true },
  { label: 'Mkato AI',       href: '/ai' },
  { label: 'Upload Paper',   href: '/upload' },
  { label: 'Flashcards',     href: '/flashcards' },
  { label: 'Pass Predictor', href: '/predictor' },
  { label: 'Study Planner',  href: '/planner' },
  { label: 'My Notes',       href: '/notes' },
]

function PaperCard({ paper, index }: { paper: Paper; index: number }) {
  const [downloading, setDownloading] = useState(false)

  function handleDownload() {
    if (paper.isPremium || downloading) return
    setDownloading(true)
    setTimeout(() => setDownloading(false), 1800)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      style={{
        background: 'var(--off-white)',
        borderRadius: '14px',
        padding: '22px',
        border: '1px solid rgba(74,155,142,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
          background: paper.isPremium ? '#FFF4E6' : 'var(--teal-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={18} color={paper.isPremium ? '#C87A00' : 'var(--teal)'} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)',
            lineHeight: 1.35, marginBottom: '4px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {paper.title}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: '600' }}>
            {paper.course}
          </p>
        </div>

        {paper.isPremium && (
          <span style={{
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em',
            color: '#C87A00', background: '#FFF4E6',
            border: '1px solid rgba(200,122,0,0.2)',
            borderRadius: '6px', padding: '3px 8px', flexShrink: 0,
          }}>
            PREMIUM
          </span>
        )}
      </div>

      {/* Meta grid */}
      <div style={{
        display: 'flex', background: 'var(--eggshell)',
        borderRadius: '8px', overflow: 'hidden',
      }}>
        {[
          { label: 'University', value: paper.university.replace('University of ', 'U. of ') },
          { label: 'Year',       value: paper.year },
          { label: 'Pages',      value: `${paper.pages}pp` },
          { label: 'Downloads',  value: paper.downloads.toLocaleString() },
        ].map((meta, i) => (
          <div key={meta.label} style={{
            flex: '1 1 0', padding: '8px 10px',
            borderRight: i < 3 ? '1px solid rgba(74,155,142,0.1)' : 'none',
          }}>
            <p style={{
              fontSize: '10px', color: 'var(--text-light)', fontWeight: '500',
              marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {meta.label}
            </p>
            <p style={{
              fontSize: '12px', color: 'var(--text-dark)', fontWeight: '600',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {meta.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          style={{
            flex: 1, padding: '9px 0',
            background: 'transparent',
            border: '1.5px solid rgba(74,155,142,0.2)',
            borderRadius: '9px', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.borderColor = 'var(--teal)'
            b.style.color = 'var(--teal)'
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.borderColor = 'rgba(74,155,142,0.2)'
            b.style.color = 'var(--text-mid)'
          }}
        >
          <Eye size={14} /> Preview
        </button>

        <button
          onClick={handleDownload}
          disabled={paper.isPremium}
          style={{
            flex: 1, padding: '9px 0',
            background: paper.isPremium ? '#FFF4E6' : 'var(--teal)',
            border: 'none', borderRadius: '9px',
            cursor: paper.isPremium ? 'default' : 'pointer',
            fontSize: '13px', fontWeight: '600',
            color: paper.isPremium ? '#C87A00' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            opacity: downloading ? 0.75 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {downloading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '13px', height: '13px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white', borderRadius: '50%',
              }}
            />
          ) : paper.isPremium ? (
            <><Lock size={13} /> Unlock</>
          ) : (
            <><Download size={13} /> Download</>
          )}
        </button>
      </div>
    </motion.article>
  )
}

function FilterSelect({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '9px 32px 9px 12px',
        background: 'var(--off-white)',
        border: '1.5px solid rgba(74,155,142,0.18)',
        borderRadius: '9px', fontSize: '13px',
        fontWeight: '500', color: 'var(--text-dark)',
        outline: 'none', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
      }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

export default function PapersPage() {
  const [search, setSearch]         = useState('')
  const [university, setUniversity] = useState('All Universities')
  const [year, setYear]             = useState('All Years')

  const filtered = SAMPLE_PAPERS.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.title.toLowerCase().includes(q) ||
       p.course.toLowerCase().includes(q) ||
       p.university.toLowerCase().includes(q)) &&
      (university === 'All Universities' || p.university === university) &&
      (year === 'All Years' || p.year === year)
    )
  })

  const hasFilters = search || university !== 'All Universities' || year !== 'All Years'

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
                  if (!item.active)(e.currentTarget as HTMLDivElement).style.background = 'var(--eggshell)'
                }}
                onMouseLeave={e => {
                  if (!item.active)(e.currentTarget as HTMLDivElement).style.background = 'transparent'
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

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                Past Papers
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                {filtered.length} of {SAMPLE_PAPERS.length} papers
              </p>
            </div>

            <Link href="/upload" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 18px', background: 'var(--teal)',
                border: 'none', borderRadius: '10px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', color: 'white',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                Upload a Paper <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={15} color="var(--text-light)" style={{
              position: 'absolute', left: '13px',
              top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by course name, unit code, or topic..."
              style={{
                width: '100%', padding: '10px 36px 10px 36px',
                background: 'var(--off-white)',
                border: '1.5px solid rgba(74,155,142,0.18)',
                borderRadius: '9px', fontSize: '13px',
                color: 'var(--text-dark)', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--teal)'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,155,142,0.18)'}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: '11px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', padding: '2px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={14} color="var(--text-light)" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <FilterSelect value={university} onChange={setUniversity} options={UNIVERSITIES} />
          <FilterSelect value={year} onChange={setYear} options={YEARS} />

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => {
                  setSearch('')
                  setUniversity('All Universities')
                  setYear('All Years')
                }}
                style={{
                  padding: '9px 14px', background: 'transparent',
                  border: '1.5px solid rgba(226,75,74,0.25)',
                  borderRadius: '9px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '500', color: '#791F1F',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <X size={12} /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '14px',
              }}
            >
              {filtered.map((paper, i) => (
                <PaperCard key={paper.id} paper={paper} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center', padding: '80px 24px',
                background: 'var(--off-white)', borderRadius: '16px',
                border: '1px dashed rgba(74,155,142,0.2)',
              }}
            >
              <BookOpen size={36} color="rgba(74,155,142,0.25)" style={{ marginBottom: '14px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '6px' }}>
                No papers found
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setUniversity('All Universities')
                  setYear('All Years')
                }}
                style={{
                  background: 'var(--teal)', color: 'white',
                  border: 'none', borderRadius: '9px',
                  padding: '10px 22px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
