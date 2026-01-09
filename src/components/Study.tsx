import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { idioms, getFrequencyLabel } from '../data/idioms'
import { motion, AnimatePresence } from 'framer-motion'

interface StudyProps {
  options: { freq: string; day: number }
  onBack: () => void
}

const Study: React.FC<StudyProps> = ({ options }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredIdioms = useMemo(() => {
    let result = idioms
    if (options.freq !== 'all') {
      result = result.filter((i) => {
        if (options.freq === 'high') return i.frequency >= 12
        if (options.freq === 'mid') return i.frequency >= 6 && i.frequency < 12
        if (options.freq === 'low') return i.frequency < 6
        return true
      })
    }
    const start = (options.day - 1) * 30
    return result.slice(start, start + 30)
  }, [options])

  const currentIdiom = filteredIdioms[currentIndex]

  if (filteredIdioms.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>该分类下暂无成语，请尝试其他设置。</p>
      </div>
    )
  }

  const next = () => {
    if (currentIndex < filteredIdioms.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {filteredIdioms.length}
        </span>
        <span className="glass-card" style={{ padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem' }}>
          {getFrequencyLabel(currentIdiom.frequency)} ({currentIdiom.frequency}次)
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdiom.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card"
          style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem' }}
        >
          <h2 style={{ fontSize: '3rem', letterSpacing: '0.5rem' }}>{currentIdiom.word}</h2>
          <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
              {currentIdiom.definition}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={prev} disabled={currentIndex === 0} style={{ flex: 1 }}>
          <ChevronLeft /> 上一个
        </button>
        <button className="btn btn-primary" onClick={next} disabled={currentIndex === filteredIdioms.length - 1} style={{ flex: 1 }}>
          下一个 <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default Study
