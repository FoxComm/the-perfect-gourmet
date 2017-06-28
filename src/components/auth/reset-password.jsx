/* @flow */

import React, { Component, Element } from 'react';

// libs
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { browserHistory } from 'lib/history';
import localized from 'lib/i18n';
import { isAuthorizedUser } from 'paragons/auth';
import classNames from 'classnames';

// components
import ShowHidePassword from 'components/core/forms/show-hide-password';
import { FormField, Form } from 'components/core/forms';
import Button from 'components/core/buttons';
import AuthContainer from './auth-container';

// actions
import { resetPassword } from 'modules/auth';

// types
import type { Localized } from 'lib/i18n';
import type { User } from 'types/auth';

// styles
import styles from './auth.css';
import s from './auth-page.css';

type ResetState = {
  isReseted: boolean,
  passwd1: string,
  passwd2: string,
  error: ?string,
};

type Props = Localized & {
  location: Object,
  resetPassword: (code: string, password: string) => Promise<*>,
  user: User | {},
  isBannerVisible: boolean,
};

class ResetPassword extends Component {
  props: Props;

  state: ResetState = {
    isReseted: false,
    passwd1: '',
    passwd2: '',
    error: null,
  };

  componentDidMount() {
    if (isAuthorizedUser(this.props.user)) {
      browserHistory.push('/');
    }
  }

  @autobind
  handleSubmit(): ?Promise<*> {
    const { passwd1, passwd2 } = this.state;
    const code = _.get(this.props, 'location.query.code');

    if (passwd1 != passwd2) {
      this.setState({
        error: this.props.t('Passwords must match'),
      });

      return Promise.reject({
        password: 'Passwords must match',
      });
    }

    if (code == null || _.isEmpty(code)) {
      this.setState({
        error: this.props.t('Code cannot be empty'),
      });

      return Promise.reject({
        code: 'Code cannot be empty',
      });
    }

    return this.props.resetPassword(code, passwd1).then(() => {
      this.setState({
        isReseted: true,
        error: null,
      });
    }).catch(() => {
      return this.setState({
        error: this.props.t('Passwords do not match or security code is invalid.'),
      });
    });
  }

  get topMessage(): Element<*> {
    const { isReseted, error } = this.state;
    const { t } = this.props;

    if (error) {
      return (
        <div styleName="top-message-error">
          {error}
        </div>
      );
    }

    if (isReseted) {
      return (
        <div styleName="top-message-success">
          {t('Your password was successfully reset.')}
        </div>
      );
    }

    return (
      <div styleName="top-message">
        {t('Your new password must be at least 8 characters long.')}
      </div>
    );
  }

  @autobind
  updateForm({target}: any) {
    this.setState({
      [target.name]: target.value,
    });
  }

  get passwordFields(): ?Element<*>[] {
    const { isReseted, passwd1, passwd2, error } = this.state;
    const { t } = this.props;

    if (isReseted) return null;

    return [
      <FormField key="passwd1" styleName="form-field" error={!!error}>
        <ShowHidePassword
          className={styles['form-field-input']}
          placeholder={t('NEW PASSWORD')}
          type="password"
          minLength={8}
          value={passwd1}
          name="passwd1"
          onChange={this.updateForm}
          required
        />
      </FormField>,
      <FormField key="passwd2" styleName="form-field" error={!!error}>
        <ShowHidePassword
          className={styles['form-field-input']}
          placeholder={t('CONFIRM PASSWORD')}
          type="password"
          minLength={8}
          value={passwd2}
          name="passwd2"
          onChange={this.updateForm}
          required
        />
      </FormField>,
    ];
  }

  goToLogin: Object = () => {
    browserHistory.push('/login');
  };

  get primaryButton(): Element<any> {
    const { isReseted } = this.state;
    const { t } = this.props;

    if (isReseted) {
      return (
        <Button styleName="primary-button" type="button" onClick={this.goToLogin}>{t('BACK TO LOG IN')}</Button>
      );
    }

    return <Button styleName="primary-button" type="submit">{t('RESET PASSWORD')}</Button>;
  }

  render(): Element<*> {
    const { t, isBannerVisible, location } = this.props;

    const className = classNames(s.forms, {
      [s['_without-banner']]: !isBannerVisible,
    });

    return (
      <div className={s.container}>
        <AuthContainer
          path={location.pathname}
          query={location.query}
          isBannerVisible={isBannerVisible}
        >
          <div className={className}>
            <div styleName="auth-block">
              <div styleName="title">{t('RESET PASSWORD')}</div>
              {this.topMessage}
              <Form onSubmit={this.handleSubmit}>
                {this.passwordFields}
                {this.primaryButton}
              </Form>
            </div>
          </div>
        </AuthContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: _.get(state.auth, 'user', {}),
    isBannerVisible: _.get(state.banner, 'isVisible', false),
  };
};

export default connect(mapStateToProps, {
  resetPassword,
})(localized(ResetPassword));
