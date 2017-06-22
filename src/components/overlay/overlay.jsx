/* @flow */

import React from 'react';
import styles from './overlay.css';
import type { HTMLElement } from 'types';

import { Link } from 'react-router';
import { Icon } from '@foxcomm/storefront-react';

type OverlayProps = {
  children: HTMLElement,
  path: string|Object,
};

const Overlay = (props:OverlayProps) => {
  return (
    <div styleName="overlay">
      {props.children}
      <Link styleName="close-button" to={props.path}>
        <Icon name="close" styleName="close-icon" />
      </Link>
    </div>
  );
};

export default Overlay;
