/* @flow */

import React, { Component, Element } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import localized from 'lib/i18n';
import styles from './usertools.css';

import { Link } from 'react-router';

import { toggleUserMenu } from 'modules/usermenu';
import { logout } from 'modules/auth';
import { fetch as fetchCart } from 'modules/cart';

type Props = {
  toggleUserMenu: Function,
  logout: Function,
  fetchCart: Function,
  t: Function,
};

class UserMenu extends Component {
  props: Props;

  componentDidMount() {
    window.addEventListener('click', this.props.toggleUserMenu, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.props.toggleUserMenu, false);
  }

  @autobind
  handleLogout(e: Object) {
    e.stopPropagation();
    e.preventDefault();
    this.props.toggleUserMenu();
    this.props.logout().then(() => {
      this.props.fetchCart();
    });
  }

  render(): Element<*> {
    const { t } = this.props;
    return (
      <ul styleName="menu">
        <li>
          <Link to="/profile" styleName="menu-link">
            {t('PROFILE')}
          </Link>
        </li>
        <li>
          <Link
            styleName="menu-link"
            to="/logout"
            onClick={this.handleLogout}
          >{t('LOG OUT')}</Link>
        </li>

      </ul>
    );
  }
}

export default connect(null, {
  logout,
  toggleUserMenu,
  fetchCart,
})(localized(UserMenu));
