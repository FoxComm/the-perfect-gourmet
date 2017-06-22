/* @flow */

import React, { Element } from 'react';

// libs
import { connect } from 'react-redux';
import classNames from 'classnames';
import localized from 'lib/i18n';
import { browserHistory } from 'lib/history';
import { isAuthorizedUser } from 'paragons/auth';

// components
import { Link } from 'react-router';
import { Icon } from '@foxcomm/storefront-react';
import Categories from '../navigation/navigation';
import Search from '../search/search';

// actions
import { logout } from 'modules/auth';
import { fetch as fetchCart } from 'modules/cart';
import * as actions from 'modules/sidebar';

// types
import type { Localized } from 'lib/i18n';

import styles from './sidebar.css';

type SidebarProps = Localized & {
  isVisible: boolean,
  toggleSidebar: () => void,
  path: string,
};

const Sidebar = (props: SidebarProps): Element<*> => {
  const { t } = props;
  const sidebarClass = classNames({
    'sidebar-hidden': !props.isVisible,
    'sidebar-shown': props.isVisible,
  });
  const userAuthorized = isAuthorizedUser(props.user);

  const handleLogout = (e) => {
    e.preventDefault();
    props.logout().then(() => {
      props.fetchCart();
    });
  };

  const onLinkClick = (e) => {
    if (e.target.tagName === 'A') {
      props.toggleSidebar();
    }
  };

  const handleLoginClick = () => {
    if (!props.inAuth) {
      browserHistory.push(`/login/?redirectTo=${props.path}`);
    }
  };

  const renderSessionLink = () => {
    if (userAuthorized) {
      return (
        <a styleName="session-link" onClick={handleLogout}>
          {t('LOG OUT')}
        </a>
      );
    }

    return (
      <Link
        styleName="session-link"
        onClick={handleLoginClick}
      >
        {t('LOG IN')}
      </Link>
    );
  };

  const myProfileLink = () => {
    if (!userAuthorized) return null;

    return (
      <Link
        to="/profile"
        styleName="session-link"
        activeClassName={styles['active-link']}
      >
        PROFILE
      </Link>
    );
  };

  return (
    <div styleName={sidebarClass}>
      <div styleName="overlay" onClick={props.toggleSidebar}></div>
      <div styleName="container">
        <div styleName="controls">
          <div styleName="controls-close">
            <a styleName="close-button" onClick={props.toggleSidebar}>
              <Icon name="close" className="close-icon"/>
            </a>
          </div>
          <div styleName="controls-search">
            <Search onSearch={props.toggleSidebar} isActive/>
          </div>
          <div styleName="links-group" onClick={onLinkClick}>
            <div styleName="controls-categories">
              <Categories
                path={props.path}
              />
            </div>
            <div styleName="controls-session">
              {myProfileLink()}
            </div>
            <div styleName="controls-session">
              {renderSessionLink()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStates = state => ({
  ...state.sidebar,
  ...state.auth,
});

export default connect(mapStates, {
  ...actions,
  logout,
  fetchCart,
})(localized(Sidebar));
