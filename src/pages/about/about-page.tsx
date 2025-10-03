import { type FC, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';

import { SITE_TITLE } from '@/constants/site-constants';

const AboutPage: FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>{`${SITE_TITLE} - درباره ما`}</title>
      </Helmet>
      <div>
        <Link to="/">Home</Link>
      </div>
    </Fragment>
  );
};

export default AboutPage;
