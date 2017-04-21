/* @flow */

import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Copyright from '../../../components/footer/copyright';
import Guest from '../../../components/auth/guest';
import Login from '../../../components/auth/login';
import Signup from '../../../components/auth/signup';
import Icon from 'ui/icon';

import * as checkoutActions from 'modules/checkout';
import * as authActions from 'modules/auth';

import localized from 'lib/i18n';

import styles from './guest-auth.css';

type State = {
  authMode: string,
}

class GuestAuth extends Component {
  state: State = {
    authMode: 'login',
  };

  componentDidMount() {
    this.props.savePreviousLocation('/checkout');
  }

  @autobind
  onGuestCheckout(email: string) {
    this.props.saveEmail(email).then(() => {
      this.props.continueAction();
    });
  }

  @autobind
  toggleAuthForm(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      authMode: this.state.authMode === 'login' ? 'signup' : 'login',
    });
  }

  get authForm() {
    if (this.state.authMode == 'login') {
      return (
        <Login
          inCheckout
          title="LOG IN & CHECKOUT"
          onSignupClick={this.toggleAuthForm}
        />
      );
    }
    return (
      <Signup
        inCheckout
        title="SIGN UP & CHECKOUT"
        onLoginClick={this.toggleAuthForm}
      />
    );
  }

  render() {
    if (!this.props.isEditing) {
      return null;
    }

    return (
      <article styleName="guest-auth">
        <div styleName="home">
          <Link to="/">
             <Icon styleName="logo" name="fc-logo" />
          </Link>
          <div styleName="divider" />
          <p styleName="title">Checkout</p>
          <div styleName="divider" />
        </div>
        <div styleName="forms">
          <div styleName="auth-block">
            {this.authForm}
          </div>
          <div styleName="divider" />
          <div styleName="mobile-divider-block">
            <div styleName="mobile-divider" />
            <p>or</p>
            <div styleName="mobile-divider" />
          </div>
          <div styleName="auth-block">
            <Guest onGuestCheckout={this.onGuestCheckout}/>
          </div>
        </div>
        <div styleName="footer">
          <Copyright styleName="copyright" />
        </div>
      </article>
    );
  }
}

export default connect(null, {
  ...checkoutActions,
  ...authActions,
})(localized(GuestAuth));
