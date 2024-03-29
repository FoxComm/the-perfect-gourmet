/* @flow */

import React, { Element } from 'react';

import styles from './footer.css';

import { Icon } from '@foxcomm/storefront-react/tpg';
import { Link } from 'react-router';
import SubscriptionForm from '../email-subscription/form';
import Copyright from './copyright';

const Footer = () : Element<*> => {
  return (
    <section styleName="footer">
      <header styleName="heading">
        <h2 styleName="title">JOIN OUR NEWSLETTER</h2>
        <h3 styleName="subtitle">GET ACCESS TO SPECIAL PROMOTIONS AND OUR NEWEST CREATIONS</h3>
      </header>

      <div styleName="wrap">
        <SubscriptionForm />

        <ul styleName="links">
          <li><Link to="/about">ABOUT US</Link></li>
          <li><Link to="/stores">STORES</Link></li>
          <li><Link to="/gift-cards">GIFT CARDS</Link></li>
          <li><Link to="/frequently-asked-questions">FAQ</Link></li>
          <li><Link to="/contact-us">CONTACT US</Link></li>
          <li><Link to="/shipping-and-returns">SHIPPING & RETURNS</Link></li>
        </ul>

        <div styleName="social-links">
          <Link to="https://www.instagram.com/theperfectgourmet/" target="_blank">
            <Icon name="instagram" styleName="social-icon" />
          </Link>
          <Link to="https://www.facebook.com/PerfectGourmet/" target="_blank">
            <Icon name="facebook" styleName="social-icon" />
          </Link>
          <Link to="https://twitter.com/perfectgourmet1" target="_blank">
            <Icon name="twitter" styleName="social-icon" />
          </Link>
          <Link to="https://www.pinterest.com/perfectgourmet/" target="_blank">
            <Icon name="pinterest" styleName="social-icon" />
          </Link>
        </div>
      </div>
      <Copyright />
    </section>
  );
};

export default Footer;
