// @flow
import React, { Component } from 'react';

// libs
import { connect } from 'react-redux';
import _ from 'lodash';
import { isAuthorizedUser } from 'paragons/auth';
import { browserHistory } from 'lib/history';

// components
import Loader from 'ui/loader';

// actions
import { savePreviousLocation } from 'modules/auth';

import type { HTMLElement } from 'types';

import styles from './page.css';

type Props = {
  children: HTMLElement,
  auth: Object | {},
  savePreviousLocation: (path: string) => void,
};

type State = {
  isAuthorized: boolean,
};

class Page extends Component {
  props: Props;

  state: State = {
    isAuthorized: !_.isEmpty(this.props.auth) && isAuthorizedUser(this.props.auth.user),
  };

  componentDidMount() {
    const { auth } = this.props;

    if (!this.state.isAuthorized) {
      this.props.savePreviousLocation('/profile');
      browserHistory.push('/login');
    }
  }

  get content() {
    if (!this.state.isAuthorized) return <Loader />;

    return (
      <div styleName="profile">
        <h1 styleName="title">My Account</h1>
        <div styleName="content">
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    return this.content;
  }
}

const mapStateToProps = (state) => {
  return {
    auth: _.get(state, 'auth', {}),
  };
};

export default connect(mapStateToProps, {
  savePreviousLocation,
})(Page);
