/* @flow */

import React, { Component, Element } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import * as analytics from 'lib/analytics';
import { browserHistory } from 'lib/history';
import localized from 'lib/i18n';

// components
import { Link } from 'react-router';
import { TextInput } from 'components/core/inputs';
import ShowHidePassword from 'components/core/forms/show-hide-password';
import { FormField, Form } from 'components/core/forms';
import Button from 'components/core/buttons';
import ErrorAlerts from '@foxcomm/wings/lib/ui/alerts/error-alerts';

// actions
import * as actions from 'modules/auth';
import { fetch as fetchCart, saveLineItemsAndCoupons } from 'modules/cart';

// types
import type { SignUpPayload } from 'types/auth';
import type { Localized } from 'lib/i18n';

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
  fetchCart: () => Promise<*>,
  saveLineItemsAndCoupons: (merge: boolean) => Promise<*>,
  onLoginClick: (event: SyntheticEvent) => void,
  title?: string|Element<*>|null,
  onAuthenticated?: Function,
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
    }).catch((err) => {
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
    }).then((response) => {
      analytics.completeRegistration();
      return response;
    });

    if (this.props.onAuthenticated) {
      signUp.then(this.props.onAuthenticated);
    }
  }

  get title() {
    const { t, title } = this.props;

    return (
      <div styleName="title">{title || t('SIGN UP')}</div>
    );
  }

  get stageSwitch() {
    const { inCheckout, onLoginClick, t } = this.props;

    if (!inCheckout) return null;

    const loginLink = (
      <Link onClick={onLoginClick} styleName="link">
        {t('Log in')}
      </Link>
    );

    return (
      <div styleName="switch-stage">
        {t('Already have an account?')} {loginLink}
      </div>
    );
  }

  render(): Element<*> {
    const { email, password, username, emailError, usernameError } = this.state;
    const { t, isLoading } = this.props;

    return (
      <div>
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
              minLength={8}
              required
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
        {this.stageSwitch}
      </div>
    );
  }
}

const mapState = state => ({
  cart: state.cart,
  isLoading: _.get(state.asyncActions, ['auth-signup', 'inProgress'], false),
  location: _.get(state.routing, 'location', {}),
});

export default connect(mapState, {
  ...actions,
  fetchCart,
  saveLineItemsAndCoupons,
})(localized(Signup));
