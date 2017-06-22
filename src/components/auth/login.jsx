/* @flow */

import React, { Component, Element } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
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
import type { Localized } from 'lib/i18n';
import type { LoginPayload } from 'types/auth';

import styles from './auth.css';

type AuthState = {
  email: string,
  password: string,
  error: ?string,
};

type Props = Localized & {
  isLoading: boolean,
  authenticate: (payload: LoginPayload) => Promise<*>,
  fetchCart: () => Promise<*>,
  saveLineItemsAndCoupons: (merge: boolean) => Promise<*>,
  onAuthenticated?: Function,
  title?: string|Element<*>|null,
  onSignupClick: (event: SyntheticEvent) => void,
  inCheckout: boolean,
  location: Object | {},
};

class Login extends Component {
  props: Props;

  state: AuthState = {
    email: '',
    password: '',
    error: null,
  };

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
    const { inCheckout } = this.props;
    const kind = 'merchant';

    const auth = this.props.authenticate({email, password, kind}).then(() => {
      this.props.saveLineItemsAndCoupons(true);
      browserHistory.push(inCheckout ? '/checkout' : this.redirectPath);
    }, (err) => {
      const errors = _.get(err, ['responseJson', 'errors'], [err.toString()]);

      const migratedErrorPresent = _.find(errors, (error) => {
        return error.indexOf('is migrated and has to reset password') >= 0;
      });

      if (migratedErrorPresent) {
        browserHistory.push(inCheckout ? '/checkout' : this.redirectPath);
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

  get redirectPath() {
    const { location } = this.props;
    const path = location.query.redirectTo;

    if (path) return path;
    return '';
  }

  get title() {
    const { t, title } = this.props;

    return (
      <div styleName="title">{title || t('LOG IN')}</div>
    );
  }

  get stageSwitch() {
    const { inCheckout, onSignupClick, t } = this.props;

    if (!inCheckout) return null;

    const signupLink = (
      <Link onClick={onSignupClick} styleName="link">
        {t('Sign Up')}
      </Link>
    );

    return (
      <div styleName="switch-stage">
        {t('Don’t have an account?')} {signupLink}
      </div>
    );
  }

  render(): Element<*> {
    const { password, email } = this.state;
    const { t, isLoading } = this.props;

    const path = this.redirectPath;
    const linkToRestore = path ? `/restore-password?redirectTo=${path}` : '/restore-password';
    const restoreLink = (
      <Link to={linkToRestore} styleName="restore-link">
        {t('forgot?')}
      </Link>
    );

    return (
      <div>
        {this.title}
        <Form onSubmit={this.authenticate}>
          <FormField key="email" styleName="form-field" error={this.state.error}>
            <TextInput
              placeholder={t('EMAIL')}
              value={email}
              type="email"
              onChange={this.onChangeEmail}
              required
            />
          </FormField>
          <FormField key="passwd" styleName="form-field" error={!!this.state.error}>
            <TextInputWithLabel
              styleName="form-field-input"
              placeholder="PASSWORD"
              label={!password && restoreLink}
              value={password}
              onChange={this.onChangePassword}
              type="password"
              required
            />
          </FormField>
          <Button
            type="submit"
            styleName="primary-button"
            isLoading={isLoading}
          >
            {t('LOG IN')}
          </Button>
        </Form>
        {this.stageSwitch}
      </div>
    );
  }
}


const mapState = state => ({
  cart: state.cart,
  isLoading: _.get(state.asyncActions, ['auth-login', 'inProgress'], false),
  location: _.get(state.routing, 'location', {}),
});


export default connect(mapState, {
  ...actions,
  fetchCart,
  saveLineItemsAndCoupons,
})(localized(Login));
