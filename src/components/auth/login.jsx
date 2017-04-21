/* @flow */

import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { isAuthorizedUser } from 'paragons/auth';
import { browserHistory } from 'lib/history';
import localized from 'lib/i18n';

// components
import { Link } from 'react-router';
import { TextInput, TextInputWithLabel } from 'ui/inputs';
import { FormField, Form } from 'ui/forms';
import Button from 'ui/buttons';

// actions
import * as actions from 'modules/auth';
import { fetch as fetchCart, saveLineItemsAndCoupons } from 'modules/cart';

// types
import type { HTMLElement } from 'types';
import type { User } from 'types/auth';
import type { Localized } from 'lib/i18n';

import styles from './auth.css';

type AuthState = {
  email: string,
  password: string,
  error: ?string,
};

type Props = Localized & {
  previousLocation: string,
  isLoading: boolean,
  authenticate: Function,
  fetchCart: Function,
  saveLineItemsAndCoupons: Function,
  onAuthenticated?: Function,
  title?: string|Element|null,
  onSignupClick: Function,
  user: User | {},
};

class Login extends Component {
  props: Props;

  state: AuthState = {
    email: '',
    password: '',
    error: null,
  };

  componentDidMount() {
    if (isAuthorizedUser(this.props.user)) {
      browserHistory.push('/');
    }
  }

  @autobind
  onChangeEmail({target}: any) {
    this.setState({
      email: target.value,
      error: null,
    });
  }

  @autobind
  onChangePassword({target}: any) {
    this.setState({
      password: target.value,
      error: null,
    });
  }

  @autobind
  authenticate() {
    const { email, password } = this.state;
    const kind = 'merchant';
    const auth = this.props.authenticate({email, password, kind}).then(() => {
      this.props.saveLineItemsAndCoupons(true);
      browserHistory.push(this.props.previousLocation);
    }, (err) => {
      const errors = _.get(err, ['responseJson', 'errors'], [err.toString()]);

      const migratedErrorPresent = _.find(errors, (error) => {
        return error.indexOf('is migrated and has to reset password') >= 0;
      });

      if (migratedErrorPresent) {
        browserHistory.push(this.props.previousLocation);
        return;
      }

      this.setState({error: 'Email or password is invalid'});
    });

    if (this.props.onAuthenticated) {
      auth.then(this.props.onAuthenticated);
    }
  }

  @autobind
  googleAuthenticate(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.props.googleSignin().then(() => {
      this.props.fetchCart();
    });
  }

  get title() {
    const { t, title } = this.props;
    if (title === null) return null;

    return (
      <div styleName="title">{title || t('LOG IN')}</div>
    );
  }

  render(): HTMLElement {
    const { password, email } = this.state;
    const { props } = this;
    const { t } = props;

    const restoreLink = (
      <Link to="/restore-password" styleName="restore-link">
        {t('forgot?')}
      </Link>
    );

    const signupLink = (
      <Link to="/signup" onClick={props.onSignupClick} styleName="link">
        {t('Sign Up')}
      </Link>
    );

    return (
      <div styleName="auth-block">
        {this.title}
        <Form onSubmit={this.authenticate}>
          <FormField key="email" styleName="form-field" error={this.state.error}>
            <TextInput placeholder={t('EMAIL')} value={email} type="email" onChange={this.onChangeEmail} />
          </FormField>
          <FormField key="passwd" styleName="form-field" error={!!this.state.error}>
            <TextInputWithLabel
              styleName="form-field-input"
              placeholder="PASSWORD"
              label={!password && restoreLink}
              value={password}
              onChange={this.onChangePassword} type="password"
            />
          </FormField>
          <Button
            type="submit"
            styleName="primary-button"
            isLoading={this.props.isLoading}
          >
            {t('LOG IN')}
          </Button>
        </Form>
        <div styleName="switch-stage">
          {t('Don’t have an account?')} {signupLink}
        </div>
      </div>
    );
  }
}


const mapState = state => ({
  cart: state.cart,
  isLoading: _.get(state.asyncActions, ['auth-login', 'inProgress'], false),
  previousLocation: _.get(state.auth, 'previousLocation', ''),
  user: _.get(state.auth, 'user', {}),
});


export default connect(mapState, {
  ...actions,
  fetchCart,
  saveLineItemsAndCoupons,
})(localized(Login));
