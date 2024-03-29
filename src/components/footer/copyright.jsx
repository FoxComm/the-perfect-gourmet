/* @flow */

import React, { Element } from 'react';

import styles from './footer.css';

import { Link } from 'react-router';

const Copyright = () : Element<*> => {
  return (
    <div styleName="copyright">
      <p>&copy; THE PERFECT GOURMET</p>
      <ul>
        <li><Link to="terms-of-use">Terms</Link></li>
        <li><Link to="privacy-policy">Privacy</Link></li>
      </ul>
      <p><a href="http://foxcommerce.com/" target="_blank" rel="noopener noreferrer">POWERED BY FOXCOMMERCE</a>.</p>
    </div>
  );
};

export default Copyright;
