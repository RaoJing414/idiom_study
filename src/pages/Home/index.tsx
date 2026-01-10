import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardCheck, GraduationCap, Flame, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { idioms } from '../../data/idioms';
import { progressApi } from '../../api/progress';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [freq, setFreq] = useState('all');
  const [day, setDay] = useState(1);
  const [stats, setStats] = useState({ mastered: 0, learning: 0, wrong: 0 });

  useEffect(() => {
    const fetchProgress = async () => {
      const progress = await progressApi.getAll();
      setStats({
        mastered: progress.filter(p => p.status === 'mastered').length,
        learning: progress.filter(p => p.status === 'learning').length,
        wrong: progress.filter(p => p.lastQuizResult === false).length,
      });
    };
    fetchProgress();
  }, []);

  const frequencies = [
    { label: '全部', value: 'all', desc: '包含库中 100+ 所有成语' },
    { label: '重点', value: 'high', desc: '频率 > 12 次的高频必会' },
    { label: '常见', value: 'mid', desc: '频率 6-12 次的常规成语' },
    { label: '一般', value: 'low', desc: '频率 < 6 次的生僻词汇' },
  ];

  const filteredIdiomsCount = useMemo(() => {
    if (freq === 'all') return idioms.length;
    return idioms.filter((i) => {
      if (freq === 'high') return i.frequency >= 12;
      if (freq === 'mid') return i.frequency >= 6 && i.frequency < 12;
      if (freq === 'low') return (i.frequency || 0) < 6;
      return true;
    }).length;
  }, [freq]);

  const totalDays = Math.ceil(filteredIdiomsCount / 30) || 1;
  const currentDay = Math.min(day, totalDays);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'left', padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
          你好，<span className="text-gradient">学习者</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          今天你想掌握哪些成语？
        </p>
      </section>

      {/* Stats Mini Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <Flame size={20} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.mastered}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>已掌握</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <ClipboardCheck size={20} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.learning}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>学习中</div>
        </div>
        <div 
          className="glass-card card-hover" 
          onClick={() => navigate('/wrong-collection')}
          style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', border: stats.wrong > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--glass-border)' }}
        >
          <AlertCircle size={20} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.wrong}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>错题集</div>
        </div>
      </div>

      {/* Frequency Selection */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>选择学习分类</h4>
          <span className="badge">{filteredIdiomsCount} 个成语</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
          {frequencies.map((f) => (
            <div
              key={f.value}
              className={`glass-card card-hover ${freq === f.value ? 'active' : ''}`}
              onClick={() => {
                setFreq(f.value);
                setDay(1);
              }}
              style={{
                cursor: 'pointer',
                padding: '1.25rem',
                border: freq === f.value ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                background: freq === f.value ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--glass-bg)',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', color: freq === f.value ? 'var(--primary)' : 'inherit' }}>{f.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress / Group Selection */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>学习计划 (共 {totalDays} 组)</h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>当前已选：第 {currentDay} 组</span>
        </div>
        <div 
          className="no-scrollbar"
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            overflowX: 'auto', 
            padding: '0.5rem 0.2rem 1.5rem 0.2rem',
            margin: '0 -1rem',
            paddingLeft: '1rem'
          }}
        >
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <motion.div
              key={d}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDay(d)}
              style={{
                minWidth: '100px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px',
                cursor: 'pointer',
                background: currentDay === d ? 'var(--primary)' : 'var(--glass-bg)',
                border: '1px solid',
                borderColor: currentDay === d ? 'var(--primary)' : 'var(--glass-border)',
                transition: 'all 0.3s ease',
                boxShadow: currentDay === d ? '0 10px 20px rgba(var(--primary-rgb), 0.3)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.8, color: currentDay === d ? 'white' : 'inherit' }}>DAY</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: currentDay === d ? 'white' : 'inherit' }}>{d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate(`/study?freq=${freq}&day=${currentDay}`)} 
          style={{ height: '4.5rem', fontSize: '1.1rem', borderRadius: '16px' }}
        >
          <BookOpen /> 开始学习本组
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => navigate(`/quiz/idiom?freq=${freq}&day=${currentDay}`)} 
            style={{ height: '4.5rem', fontSize: '1rem', borderRadius: '16px' }}
          >
            <ClipboardCheck size={20} /> 成语自测
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => navigate(`/quiz/definition?freq=${freq}&day=${currentDay}`)} 
            style={{ height: '4.5rem', fontSize: '1rem', borderRadius: '16px' }}
          >
            <GraduationCap size={20} /> 释义自测
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
