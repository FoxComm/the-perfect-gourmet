/* @flow */

import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { browserHistory } from 'lib/history';
import localized from 'lib/i18n';
import { isAuthorizedUser } from 'paragons/auth';

// components
import { Link } from 'react-router';
import { TextInput } from 'ui/inputs';
import { FormField, Form } from 'ui/forms';
import Button from 'ui/buttons';
import Icon from 'ui/icon';

// actions
import * as actions from 'modules/auth';

// types
import type { HTMLElement } from 'types';
import type { RestorePasswordFormProps } from 'types/auth';
import type { User } from 'types/auth';

import styles from './auth.css';

type RestoreState = {
  emailSent: boolean,
  error: ?string,
  email: string,
};

type Props = RestorePasswordFormProps & {
  user: User | {},
  location: Object | {},
};

class RestorePasswordForm extends Component {
  props: Props;

  state: RestoreState = {
    emailSent: false,
    error: null,
    email: '',
  };

  componentDidMount() {
    if (isAuthorizedUser(this.props.user)) {
      browserHistory.push('/');
    }
  }

  @autobind
  handleSubmit(): ?Promise {
    const { email } = this.state;
    const { t } = this.props;

    if (_.isEmpty(email)) {
      return Promise.reject({
        email: t('Oops! We don’t have a user with that email. Please check your entry and try again.'),
      });
    }

    return this.props.restorePassword(email)
      .then(() => {
        this.setState({
          emailSent: true,
          error: null,
        });
      }).catch(() => {
        this.setState({
          error: t(`Oops! We don’t have a user with that email. Please check your entry and try again.`),
        });
      }
    );
  }

  get topMessage(): HTMLElement {
    const { emailSent, error, email } = this.state;
    const { t } = this.props;

    if (error) {
      return (
        <div styleName="top-message">
          {error}
        </div>
      );
    }

    if (emailSent) {
      return (
        <div styleName="top-message">
          {t('An email was successfully sent to')} <strong>{email}</strong> {t('with reset instructions')}!
        </div>
      );
    }

    return (
      <div styleName="top-message">
        {this.props.topMessage}
      </div>
    );
  }

  @autobind
  changeEmail({target}: any) {
    this.setState({
      email: target.value,
    });
  }

  get emailField(): ?HTMLElement {
    const { emailSent, email } = this.state;
    const { t } = this.props;

    if (emailSent) return null;

    return (
      <FormField name="email" key="email" styleName="form-field">
        <TextInput
          placeholder={t('EMAIL')}
          required
          type="email"
          value={email}
          onChange={this.changeEmail}
        />
      </FormField>
    );
  }

  get redirectPath() {
    const { location } = this.props;
    const path = location.query.redirectTo;

    if (path) return path;
    return '';
  }

  goToLogin: Object = () => {
    const path = this.redirectPath;
    const linkTo = path ? `/login?redirectTo=${path}` : '/login';
    browserHistory.push(linkTo);
  };

  get primaryButton(): HTMLElement {
    const { emailSent } = this.state;
    const { t } = this.props;

    if (emailSent) {
      return (
        <Button styleName="primary-button" onClick={this.goToLogin} type="button">
          {t('BACK TO LOG IN')}
        </Button>
      );
    }

    return <Button styleName="primary-button" type="submit">{t('SUBMIT')}</Button>;
  }

  get switchStage(): ?HTMLElement {
    const { emailSent } = this.state;
    const { t } = this.props;

    if (!emailSent) {
      const path = this.redirectPath;
      const linkTo = path ? `/login?redirectTo=${path}` : '/login';

      return (
        <div styleName="switch-stage">
          <Link to={linkTo} styleName="link">
            {t('BACK TO LOG IN')}
          </Link>
        </div>
      );
    }
  }

  get logo() {
    const { inCheckout } = this.props;
    if (inCheckout) return null;

    return (
      <div styleName="logo">
        <Link to="/">
          <Icon styleName="logo-icon" name="fc-logo"/>
        </Link>
      </div>
    );
  }

  render(): HTMLElement {
    return (
      <div styleName="auth-block">
        {this.logo}
        <div styleName="title">{this.props.title}</div>
        {this.topMessage}
        <Form onSubmit={this.handleSubmit}>
          {this.emailField}
          {this.primaryButton}
        </Form>
        {this.switchStage}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: _.get(state.auth, 'user', {}),
    location: _.get(state.routing, 'location', {}),
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(localized(RestorePasswordForm));
