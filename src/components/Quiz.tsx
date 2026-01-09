import React, { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { idioms, type Idiom } from '../data/idioms'
// import { motion, AnimatePresence } from 'framer-motion'

interface QuizProps {
  mode: 'idiom' | 'definition'
  options: { freq: string; day: number }
  onBack: () => void
}

const Quiz: React.FC<QuizProps> = ({ mode, options }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizOptions, setQuizOptions] = useState<Idiom[]>([])

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

  useEffect(() => {
    if (!currentIdiom) return
    
    // Generate 4 distractors
    const others = idioms.filter(i => i.id !== currentIdiom.id)
    const shuffled = others.sort(() => 0.5 - Math.random())
    const selectedDistractors = shuffled.slice(0, 4)
    
    // Mix with current
    const allOptions = [...selectedDistractors, currentIdiom].sort(() => 0.5 - Math.random())
    setQuizOptions(allOptions)
    setShowAnswer(false)
    setSelectedOption(null)
  }, [currentIndex, currentIdiom])

  if (filteredIdioms.length === 0) {
    return <div className="glass-card">暂无数据</div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {filteredIdioms.length}
        </span>
        <span className="glass-card" style={{ padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem' }}>
          {mode === 'idiom' ? '看着成语选释义' : '看着释义选成语'}
        </span>
      </div>

      <div className="glass-card" style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {mode === 'idiom' ? (
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{currentIdiom.word}</h2>
        ) : (
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{currentIdiom.definition}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {quizOptions.map((opt, idx) => {
          const isCorrect = opt.id === currentIdiom.id
          const isSelected = selectedOption === idx
          
          let btnClass = 'btn-outline'
          if (showAnswer) {
            if (isCorrect) btnClass = 'btn-primary'
            else if (isSelected) btnClass = 'btn-outline' // Could mark as red if we had error color
          } else if (isSelected) {
            btnClass = 'btn-primary'
          }

          return (
            <button
              key={idx}
              className={`btn ${btnClass}`}
              onClick={() => {
                setSelectedOption(idx)
                setShowAnswer(true)
              }}
              style={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '1rem',
                border: isSelected && !showAnswer ? '1px solid var(--primary)' : undefined,
                backgroundColor: showAnswer && isCorrect ? 'var(--accent)' : undefined,
                opacity: showAnswer && !isCorrect && !isSelected ? 0.5 : 1
              }}
            >
              <span style={{ marginRight: '0.5rem', opacity: 0.5 }}>{String.fromCharCode(65 + idx)}.</span>
              {mode === 'idiom' ? opt.definition : opt.word}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={prev} disabled={currentIndex === 0} style={{ flex: 1 }}>
          <ChevronLeft size={18} /> 上一个
        </button>
        <button className="btn btn-outline" onClick={() => setShowAnswer(!showAnswer)} style={{ flex: 0.5 }}>
          {showAnswer ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button className="btn btn-primary" onClick={next} disabled={currentIndex === filteredIdioms.length - 1} style={{ flex: 1 }}>
          下一个 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Quiz
