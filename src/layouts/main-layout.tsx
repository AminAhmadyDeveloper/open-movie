import { type FC, Fragment } from 'react';
import { Outlet } from 'react-router';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export const MainLayout: FC = () => {
  return (
    <Fragment>
      <Header />
      <Outlet />
      <Footer className="container" />
    </Fragment>
  );
};
