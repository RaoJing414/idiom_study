import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { idioms } from '../../data/idioms';
import { progressApi } from '../../api/progress';

const Study: React.FC = () => {
  const [searchParams] = useSearchParams();
  const freq = searchParams.get('freq') || 'all';
  const day = parseInt(searchParams.get('day') || '1');
  const idParam = searchParams.get('id');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMastered, setIsMastered] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [autoShow, setAutoShow] = useState(false);

  const filteredIdioms = useMemo(() => {
    if (idParam) {
      const targetId = parseInt(idParam);
      const idiom = idioms.find(i => i.id === targetId);
      return idiom ? [idiom] : [];
    }
    let result = idioms;
    if (freq !== 'all') {
      result = result.filter((i) => {
        if (freq === 'high') return i.frequency >= 12;
        if (freq === 'mid') return i.frequency >= 6 && i.frequency < 12;
        if (freq === 'low') return (i.frequency || 0) < 6;
        return true;
      });
    }
    const start = (day - 1) * 30;
    return result.slice(start, start + 30);
  }, [freq, day, idParam]);

  const currentIdiom = filteredIdioms[currentIndex];

  useEffect(() => {
    if (currentIdiom) {
      progressApi.getById(currentIdiom.id).then(p => {
        setIsMastered(p.status === 'mastered');
      });
      // Reset showDefinition when moving to a new idiom, unless autoShow is on
      setShowDefinition(autoShow);
    }
  }, [currentIdiom, autoShow]);

  // Record study when definition is shown
  useEffect(() => {
    if (showDefinition && currentIdiom) {
      progressApi.recordStudy(currentIdiom.id);
    }
  }, [showDefinition, currentIdiom]);

  const toggleMastered = async () => {
    if (!currentIdiom) return;
    const mastered = await progressApi.toggleMastered(currentIdiom.id);
    setIsMastered(mastered);
  };

  if (filteredIdioms.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>该组暂无数据，请返回重新选择。</p>
      </div>
    );
  }

  const next = () => {
    if (currentIndex < filteredIdioms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          第 {day} 组: {currentIndex + 1} / {filteredIdioms.length}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className={`btn ${autoShow ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAutoShow(!autoShow)}
            style={{ padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', height: 'auto' }}
            title={autoShow ? '切换为手动模式' : '切换为自动模式'}
          >
            {autoShow ? <Eye size={14} /> : <EyeOff size={14} />} {autoShow ? '自动显示' : '手动点击'}
          </button>
          <button 
            className={`btn ${isMastered ? 'btn-primary' : 'btn-outline'}`}
            onClick={toggleMastered}
            style={{ padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', height: 'auto' }}
          >
            <CheckCircle size={14} /> {isMastered ? '已掌握' : '标记掌握'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdiom.id}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-card"
          style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem', cursor: !showDefinition ? 'pointer' : 'default' }}
          onClick={() => !showDefinition && setShowDefinition(true)}
        >
          <h2 style={{ fontSize: '3.5rem', letterSpacing: '0.5rem', margin: 0, color: 'var(--primary)' }}>{currentIdiom.word}</h2>
          
          <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showDefinition ? (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-main)', margin: 0, padding: '0 1rem' }}
              >
                {currentIdiom.definition}
              </motion.p>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={24} opacity={0.5} />
                <span>点击卡片显示释义</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={prev} disabled={currentIndex === 0} style={{ flex: 1, height: '3.5rem' }}>
          <ChevronLeft /> 上一个
        </button>
        <button className="btn btn-primary" onClick={next} disabled={currentIndex === filteredIdioms.length - 1} style={{ flex: 1, height: '3.5rem' }}>
          下一个 <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Study;
