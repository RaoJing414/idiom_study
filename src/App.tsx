import React, { useState, useEffect } from 'react'
import { Home as HomeIcon, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { initDB } from './db'

// Components
import Home from './components/Home'
import Study from './components/Study'
import Quiz from './components/Quiz'
import Share from './components/Share'

export type View = 'home' | 'study' | 'quiz_idiom' | 'quiz_def' | 'share'

const App: React.FC = () => {
  const [view, setView] = useState<View>('home')
  const [options, setOptions] = useState<{ freq: string; day: number }>({ freq: 'all', day: 1 })

  useEffect(() => {
    initDB()
  }, [])

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onStartStudy={(opts) => { setOptions(opts); setView('study') }} 
                    onStartQuiz={(mode, opts) => { setOptions(opts); setView(mode === 'idiom' ? 'quiz_idiom' : 'quiz_def') }} />
      case 'study':
        return <Study options={options} onBack={() => setView('home')} />
      case 'quiz_idiom':
      case 'quiz_def':
        return <Quiz mode={view === 'quiz_idiom' ? 'idiom' : 'definition'} options={options} onBack={() => setView('home')} />
      case 'share':
        return <Share onBack={() => setView('home')} />
      default:
        return <Home onStartStudy={(opts) => { setOptions(opts); setView('study') }} 
                    onStartQuiz={(mode, opts) => { setOptions(opts); setView(mode === 'idiom' ? 'quiz_idiom' : 'quiz_def') }} />
    }
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" onClick={() => setView('home')} style={{ cursor: 'pointer', fontSize: '1.5rem', margin: 0 }}>
          成语学习助手
        </h1>
        <button className="btn btn-outline" onClick={() => setView('share')} style={{ padding: '0.5rem' }}>
          <Share2 size={20} />
        </button>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {view !== 'home' && (
        <nav style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setView('home')} style={{ borderRadius: '50px', padding: '1rem' }}>
            <HomeIcon size={24} />
          </button>
        </nav>
      )}
    </div>
  )
}

export default App
