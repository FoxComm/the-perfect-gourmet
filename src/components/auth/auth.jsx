/* @flow */
import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { connect } from 'react-redux';

// components
import Login from './login';
import Signup from './signup';
import Footer from '../footer/footer';
import Header from '../header/header';

// actions
import { closeBanner } from 'modules/banner';

import styles from './auth-page.css';

type Props = {
  location: Object,
  isBannerVisible: boolean,
  closeBanner: Function,
};

class Auth extends Component {
  props: Props;

  render() {
    const { location, isBannerVisible } = this.props;
    return (
      <div styleName="container">
        <Header
          path={location.pathname}
          query={location.query}
          isBannerVisible={isBannerVisible}
          closeBanner={this.props.closeBanner}
        />
        <div styleName="forms">
          <div styleName="auth-block">
            <Login />
          </div>
          <div styleName="divider" />
          <div styleName="mobile-divider-block">
            <div styleName="mobile-divider" />
            <p>or</p>
            <div styleName="mobile-divider" />
          </div>
          <div styleName="auth-block">
            <Signup />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isBannerVisible: _.get(state.banner, 'isVisible', false),
  };
};

export default connect(mapStateToProps, {
  closeBanner,
})(Auth);
