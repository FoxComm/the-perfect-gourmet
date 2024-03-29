/* @flow */

import React from 'react';
import classNames from 'classnames';

import { Icon } from '@foxcomm/storefront-react/tpg';

import styles from './top-banner.css';

type Props = {
  isVisible: boolean,
  onClose: Function,
};

const TopBanner = (props: Props) => {
  const bannerClass = classNames(styles.banner, {
    [styles._hidden]: !props.isVisible,
  });

  return (
    <div className={bannerClass}>
      <div styleName="content">
        <span>
          To celebrate the launch of our new site, use code
          <strong styleName="strong"> PERFECT20 </strong>
          and enjoy 20% off sitewide!
        </span>
      </div>
      <div styleName="button">
        <a styleName="close" onClick={props.onClose}>
          <Icon name="close" className="close-icon" />
        </a>
      </div>
    </div>
  );
};

export default TopBanner;
