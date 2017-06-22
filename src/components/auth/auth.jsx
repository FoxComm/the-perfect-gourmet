/* @flow */
import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isAuthorizedUser } from 'paragons/auth';
import { browserHistory } from 'lib/history';

// components
import AuthContainer from './auth-container';
import Login from './login';
import Signup from './signup';

// actions
import { fetch as fetchCart } from 'modules/cart';

import type { User } from 'types/auth';

import styles from './auth-page.css';

type Props = {
  location: Object,
  isBannerVisible: boolean,
  user: User | {},
  fetchCart: () => Promise<*>,
};

class Auth extends Component {
  props: Props;

  componentDidMount() {
    if (isAuthorizedUser(this.props.user)) {
      browserHistory.push('/');
    } else {
      this.props.fetchCart();
    }
  }

  render() {
    const { location, isBannerVisible } = this.props;
    const className = classNames(styles.forms, {
      [styles['_without-banner']]: !isBannerVisible,
    });

    return (
      <div styleName="container">
        <AuthContainer
          path={location.pathname}
          query={location.query}
          isBannerVisible={isBannerVisible}
        >
          <div className={className}>
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
        </AuthContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isBannerVisible: _.get(state.banner, 'isVisible', false),
    user: _.get(state.auth, 'user', {}),
  };
};

export default connect(mapStateToProps, {
  fetchCart,
})(Auth);
