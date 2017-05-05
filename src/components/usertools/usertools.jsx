/* @flow */

import React, { Component } from 'react';

// libs
import _ from 'lodash';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { browserHistory } from 'lib/history';
import { isAuthorizedUser } from 'paragons/auth';
import localized from 'lib/i18n';

// components
import Icon from 'ui/icon';
import { Link } from 'react-router';
import UserMenu from './usermenu';

// actions
import { toggleCart } from 'modules/cart';
import { toggleUserMenu } from 'modules/usermenu';

// types
import type { HTMLElement } from 'types';
import type { Auth } from 'types/auth';

import styles from './usertools.css';

type Props = {
  toggleCart: Function, // find signature
  toggleUserMenu: Function, // find signature
  path: string,
  inAuth: boolean,
  t: any,
  isMenuVisible: boolean,
  auth: Auth,
  quantity: number,
};

class UserTools extends Component {
  props: Props;

  static defaultProps = {
    inAuth: false,
  };

  @autobind
  handleUserClick(e) {
    e.stopPropagation();
    this.props.toggleUserMenu();
  }

  @autobind
  handleLoginClick() {
    if (!this.props.inAuth) {
      browserHistory.push(`/login?redirectTo=${this.props.path}`);
    }
  }

  get renderUserInfo() {
    const { t } = this.props;
    const user = _.get(this.props, ['auth', 'user'], null);
    if (!isAuthorizedUser(user)) {
      return (
        <Link
          styleName="login-link"
          onClick={this.handleLoginClick}
        >
          {t('LOG IN')}
        </Link>
      );
    }

    return (
      <div styleName="user-info">
        <span styleName="username" onClick={this.handleUserClick}>{t('HI')}, {user.name.toUpperCase()}</span>
        {this.props.isMenuVisible && <UserMenu />}
      </div>
    );
  }

  render(): HTMLElement {
    return (
      <div styleName="tools">
        <div styleName="login">
          {this.renderUserInfo}
        </div>
        <button styleName="cart" onClick={this.props.toggleCart}>
          <Icon name="fc-cart" styleName="head-icon"/>
          <sup styleName="cart-quantity">{this.props.quantity}</sup>
        </button>
      </div>
    );
  }
}

const mapState = (state) => ({
  auth: _.get(state, 'auth', {}),
  isMenuVisible: _.get(state.usermenu, 'isVisible', false),
  quantity: _.get(state.cart, 'quantity', 0),
});

export default connect(mapState, {
  toggleCart,
  toggleUserMenu,
})(localized(UserTools));
