/* @flow */

import React from 'react';

// libs
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';

// components
import RestorePasswordForm from './restore-password-form';
import AuthContainer from './auth-container';

import type { RestorePasswordFormProps } from 'types/auth';

import styles from './auth-page.css';

type Props = RestorePasswordFormProps & {
  isBannerVisible: boolean,
  location: Object,
};

const RestorePassword = (props: Props) => {
  const { isBannerVisible, location } = props;
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
          <RestorePasswordForm
            title="FORGOT PASSWORD"
            topMessage="No worries! We’ll email you instructions on how to reset your password."
            {...props}
          />
        </div>
      </AuthContainer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isBannerVisible: _.get(state.banner, 'isVisible', false),
  };
};

export default connect(mapStateToProps)(RestorePassword);
