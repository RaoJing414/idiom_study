import React, { useState } from 'react'
import { BookOpen, ClipboardCheck, GraduationCap } from 'lucide-react'

interface HomeProps {
  onStartStudy: (options: { freq: string; day: number }) => void
  onStartQuiz: (mode: 'idiom' | 'definition', options: { freq: string; day: number }) => void
}

const Home: React.FC<HomeProps> = ({ onStartStudy, onStartQuiz }) => {
  const [freq, setFreq] = useState('all')
  const [day, setDay] = useState(1)

  const frequencies = [
    { label: '全部', value: 'all' },
    { label: '重点 (>12次)', value: 'high' },
    { label: '常见 (>6次)', value: 'mid' },
    { label: '一般 (<6次)', value: 'low' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="glass-card">
        <h3>学习参数设置</h3>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>选择成语频率</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {frequencies.map((f) => (
              <button
                key={f.value}
                className={`btn ${freq === f.value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFreq(f.value)}
                style={{ fontSize: '0.9rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>学习天数 (每组30个)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="range"
              min="1"
              max="34"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: 600, width: '3rem', textAlign: 'right' }}>第 {day} 天</span>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={() => onStartStudy({ freq, day })} style={{ height: '4rem', fontSize: '1.2rem' }}>
          <BookOpen /> 1. 学习成语
        </button>
        <button className="btn btn-outline" onClick={() => onStartQuiz('idiom', { freq, day })} style={{ height: '4rem', fontSize: '1.2rem' }}>
          <ClipboardCheck /> 2. 成语自测模式
        </button>
        <button className="btn btn-outline" onClick={() => onStartQuiz('definition', { freq, day })} style={{ height: '4rem', fontSize: '1.2rem' }}>
          <GraduationCap /> 3. 释义自测模式
        </button>
      </div>
    </div>
  )
}

export default Home
