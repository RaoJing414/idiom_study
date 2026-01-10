import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { initDB } from './db';

const App: React.FC = () => {
  useEffect(() => {
    initDB();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
