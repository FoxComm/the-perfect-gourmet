/* @flow */

import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import * as analytics from 'lib/analytics';
import { browserHistory } from 'lib/history';
import localized from 'lib/i18n';
import { isAuthorizedUser } from 'paragons/auth';

// components
import { Link } from 'react-router';
import { TextInput } from 'ui/inputs';
import ShowHidePassword from 'ui/forms/show-hide-password';
import { FormField, Form } from 'ui/forms';
import Button from 'ui/buttons';
import ErrorAlerts from '@foxcomm/wings/lib/ui/alerts/error-alerts';

// actions
import * as actions from 'modules/auth';
import { fetch as fetchCart, saveLineItemsAndCoupons } from 'modules/cart';

// types
import type { HTMLElement } from 'types';
import type { SignUpPayload } from 'modules/auth';
import type { Localized } from 'lib/i18n';
import type { User } from 'types/auth';

import styles from './auth.css';

type AuthState = {
  email: string,
  password: string,
  username: string,
  usernameError: bool|string,
  emailError: bool|string,
  generalErrors: Array<string>,
};

type Props = Localized & {
  location: Object | {},
  isLoading: boolean,
  fetchCart: Function,
  saveLineItemsAndCoupons: Function,
  onLoginClick: Function,
  title?: string|Element|null,
  onAuthenticated?: Function,
  user: User | {},
  inCheckout: boolean
};

class Signup extends Component {
  props: Props;

  state: AuthState = {
    email: '',
    password: '',
    username: '',
    usernameError: false,
    emailError: false,
    generalErrors: [],
  };

  componentDidMount() {
    if (isAuthorizedUser(this.props.user)) {
      browserHistory.push('/');
    } else if (!this.props.inCheckout) {
      this.props.fetchCart();
    }
  }

  @autobind
  onChangeEmail({target}: any) {
    this.setState({
      email: target.value,
      emailError: false,
    });
  }

  @autobind
  onChangePassword({target}: any) {
    this.setState({
      password: target.value,
    });
  }

  @autobind
  onChangeUsername({target}: any) {
    this.setState({
      username: target.value,
      usernameError: false,
    });
  }

  get redirectPath() {
    const { location } = this.props;
    const path = location.query.redirectTo;

    if (path) return path;
    return '';
  }

  @autobind
  submitUser() {
    const {email, password, username: name} = this.state;
    const payload: SignUpPayload = {email, password, name};
    const signUp = this.props.signUp(payload).then(() => {
      const lineItems = _.get(this.props, 'cart.lineItems', []);
      const couponCode = _.get(this.props, 'cart.coupon.code', null);
      const { inCheckout } = this.props;

      let operation;
      if (_.isEmpty(lineItems) && _.isNil(couponCode)) {
        operation = this.props.fetchCart();
      } else {
        operation = this.props.saveLineItemsAndCoupons(true);
      }
      operation.then(() => {
        browserHistory.push(inCheckout ? '/checkout' : this.redirectPath);
      });
    }).catch(err => {
      const errors = _.get(err, ['responseJson', 'errors'], [err.toString()]);
      let emailError = false;
      let usernameError = false;

      const restErrors = _.reduce(errors, (acc, error) => {
        if (error.indexOf('email') >= 0) {
          emailError = error;
        } else if (error.indexOf('name') >= 0) {
          usernameError = error;
        } else {
          return [...acc, error];
        }

        return acc;
      }, []);

      this.setState({
        emailError,
        usernameError,
        generalErrors: restErrors,
      });
    }).then(response => {
      analytics.completeRegistration();
      return response;
    });

    if (this.props.onAuthenticated) {
      signUp.then(this.props.onAuthenticated);
    }
  }

  get title() {
    const { t, title } = this.props;
    if (title === null) return null;

    return (
      <div styleName="title">{title || t('SIGN UP')}</div>
    );
  }

  render(): HTMLElement {
    const { email, password, username, emailError, usernameError } = this.state;
    const { t, isLoading, onLoginClick, inCheckout } = this.props;
    const path = this.redirectPath;

    const linkTo = path ? `/login?redirectTo=${path}` : '/login';

    const loginLink = (
      <Link to={linkTo} onClick={onLoginClick} styleName="link">
        {t('Log in')}
      </Link>
    );

    const className = inCheckout ? '' : styles['auth-block'];

    return (
      <div className={className}>
        {this.title}
        <Form onSubmit={this.submitUser}>
          <FormField key="username" styleName="form-field" error={usernameError}>
            <TextInput
              required
              placeholder={t('FIRST & LAST NAME')}
              name="username"
              value={username}
              onChange={this.onChangeUsername}
            />
          </FormField>
          <FormField key="email" styleName="form-field" error={emailError}>
            <TextInput
              required
              placeholder={t('EMAIL')}
              name="email"
              value={email}
              type="email"
              onChange={this.onChangeEmail}
            />
          </FormField>
          <FormField key="passwd" styleName="form-field">
            <ShowHidePassword
              className={styles['form-field-input']}
              placeholder={t('CREATE PASSWORD')}
              name="password"
              value={password}
              onChange={this.onChangePassword}
            />
          </FormField>
          <ErrorAlerts errors={this.state.generalErrors} />
          <Button
            styleName="primary-button"
            isLoading={isLoading}
            type="submit"
          >
            {t('SIGN UP')}
          </Button>
        </Form>
        <div styleName="switch-stage">
          {t('Already have an account?')} {loginLink}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  cart: state.cart,
  isLoading: _.get(state.asyncActions, ['auth-signup', 'inProgress'], false),
  location: _.get(state.routing, 'location', {}),
  user: _.get(state.auth, 'user', {}),
});

export default connect(mapState, {
  ...actions,
  fetchCart,
  saveLineItemsAndCoupons,
})(localized(Signup));
