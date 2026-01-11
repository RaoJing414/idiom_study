import { createHashRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Study from '../pages/Study';
import Quiz from '../pages/Quiz';
import Share from '../pages/Share';
import WrongCollection from '../pages/WrongCollection';

export const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'study',
        element: <Study />,
      },
      {
        path: 'quiz/:mode',
        element: <Quiz />,
      },
      {
        path: 'share',
        element: <Share />,
      },
      {
        path: 'wrong-collection',
        element: <WrongCollection />,
      },
    ],
  },
]);
