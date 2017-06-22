/* @flow */

import React from 'react';

// libs
import { connect } from 'react-redux';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

// components
import { Icon } from '@foxcomm/storefront-react';
import Search from '../search/search';
import UserTools from '../usertools/usertools';
import Navigation from '../navigation/navigation';
import TopBanner from '../top-banner/top-banner';
import Cart from '../cart/cart';
import Sidebar from '../sidebar/sidebar';
import { Link } from 'react-router';

// actions
import { toggleSidebar } from 'modules/sidebar';

import styles from './header.css';

type Props = {
  toggleSidebar: Function,
  path: string,
  query: ?Object,
  closeBanner: Function,
  isBannerVisible: boolean,
  inAuth: boolean,
};

type State = {
  isScrolled: boolean,
};

class Header extends React.Component {
  props: Props;

  state: State = {
    isScrolled: false,
  };

  static defaultProps = {
    inAuth: false,
  };

  componentDidMount() {
    this.checkScroll();
    window.addEventListener('scroll', this.checkScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkScroll);
  }

  @autobind
  checkScroll() {
    // $FlowFixMe: there will be number
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const isScrolled = scrollTop > 136;

    this.setState({isScrolled});
  }

  render() {
    const headerStyle = this.state.isScrolled ? 'header-scrolled' : 'header';
    const headerClass = classNames(styles[headerStyle], {
      [styles['_without-banner']]: !this.props.isBannerVisible,
    });

    return (
      <div>
        <TopBanner
          isVisible={this.props.isBannerVisible}
          onClose={this.props.closeBanner}
        />
        <div className={headerClass}>
          <div styleName="wrap">
            <div styleName="hamburger" onClick={this.props.toggleSidebar}>
              <Icon name="hamburger" styleName="head-icon" />
            </div>
            <div styleName="search">
              <Search isScrolled={this.state.isScrolled} />
            </div>
            <Link to="/" styleName="logo-link">
              <Icon styleName="logo" name="logo" />
            </Link>
            <div styleName="navigation">
              <Navigation path={this.props.path} />
            </div>
            <div styleName="tools">
              <UserTools
                path={this.props.path}
                query={this.props.query}
                inAuth={this.props.inAuth}
              />
            </div>
          </div>
        </div>
        <div>
          <Cart />
        </div>
        <div styleName="mobile-sidebar">
          <Sidebar
            path={this.props.path}
            inAuth={this.props.inAuth}
          />
        </div>
      </div>
    );
  }
}


export default connect(void 0, {
  toggleSidebar,
})(Header);
