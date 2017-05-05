/* @flow */
import React from 'react';

// libs
import { connect } from 'react-redux';

// components
import Footer from '../footer/footer';
import Header from '../header/header';

import { closeBanner } from 'modules/banner';

type Props = {
  path: string,
  query: Object,
  isBannerVisible: boolean,
  closeBanner: () => void,
  children: any,
};

const AuthContainer = (props: Props) => {
  return (
    <div>
      <Header
        path={props.path}
        query={props.query}
        isBannerVisible={props.isBannerVisible}
        closeBanner={props.closeBanner}
        inAuth
      />
      {props.children}
      <Footer />
    </div>
  );
};

export default connect(null, {
  closeBanner,
})(AuthContainer);
