import React, { Component } from 'react';

// components
import Login from './login';
import Signup from './signup';

import styles from './auth-page.css';

class Auth extends Component {
  render() {
    return (
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
    );
  }
}

export default Auth;
