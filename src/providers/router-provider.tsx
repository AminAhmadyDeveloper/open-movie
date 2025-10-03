import { type FC, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider as RouterProviderPrimitive } from 'react-router/dom';

import { MainLayout } from '@/layouts/main-layout';

const HomePage = lazy(() => import('@/pages/home/home-page'));
const AboutPage = lazy(() => import('@/pages/about/about-page'));
const MoviePage = lazy(() => import('@/pages/movie/movie-page'));

const router = createBrowserRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <AboutPage />,
        path: 'about',
      },
      {
        element: <MoviePage />,
        path: 'movie/:movieId',
      },
    ],
    element: <MainLayout />,
    path: '/',
  },
]);

export const RouterProvider: FC = () => {
  return <RouterProviderPrimitive router={router} />;
};
