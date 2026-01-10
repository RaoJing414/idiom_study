import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Share2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!isHome && (
            <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '0.5rem', border: 'none' }}>
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 
            className="text-gradient" 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer', fontSize: '1.5rem', margin: 0 }}
          >
            成语学习助手
          </h1>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/share')} style={{ padding: '0.5rem' }}>
          <Share2 size={20} />
        </button>
      </header>

      <main style={{ paddingBottom: isHome ? 0 : '6rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isHome && (
        <nav className="bottom-nav">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <HomeIcon size={24} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
