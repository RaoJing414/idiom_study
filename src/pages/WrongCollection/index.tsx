import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardCheck, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { idioms } from '../../data/idioms';
import { progressApi } from '../../api/progress';
import type { Idiom, Progress } from '../../types';

const WrongCollection: React.FC = () => {
  const navigate = useNavigate();
  const [wrongIdioms, setWrongIdioms] = useState<(Idiom & { progress: Progress })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWrongIdioms = async () => {
      setLoading(true);
      const allProgress = await progressApi.getAll();
      const wrongProgress = allProgress.filter(p => p.lastQuizResult === false);
      
      const enriched = wrongProgress
        .map(p => {
          const idiom = idioms.find(i => i.id === p.idiomId);
          if (idiom) return { ...idiom, progress: p };
          return null;
        })
        .filter((i): i is (Idiom & { progress: Progress }) => i !== null)
        .sort((a, b) => b.progress.quizWrongCount - a.progress.quizWrongCount);

      setWrongIdioms(enriched);
      setLoading(false);
    };

    fetchWrongIdioms();
  }, []);

  if (loading) {
    return <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>加载中...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section style={{ textAlign: 'left', padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
          我的<span className="text-gradient">错题集</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          温故而知新，攻克薄弱环节。
        </p>
      </section>

      {wrongIdioms.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1.5rem', borderRadius: '50%' }}>
            <ClipboardCheck size={48} />
          </div>
          <h3 style={{ margin: 0 }}>暂无错题</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>太棒了！你目前没有任何错题记录。</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>去学习新内容</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/quiz/idiom?source=wrong')} 
              style={{ height: '4rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              <ClipboardCheck size={20} /> 成语复习
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/quiz/definition?source=wrong')} 
              style={{ height: '4rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              <GraduationCap size={20} /> 释义复习
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, padding: '0 0.5rem' }}>错题列表 ({wrongIdioms.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <AnimatePresence>
                {wrongIdioms.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{item.word}</span>
                        <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none' }}>
                          错误 {item.progress.quizWrongCount} 次
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.definition}
                      </p>
                    </div>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => navigate(`/study?id=${item.id}`)}
                      style={{ padding: '0.5rem', marginLeft: '1rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}
                    >
                      <BookOpen size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WrongCollection;
