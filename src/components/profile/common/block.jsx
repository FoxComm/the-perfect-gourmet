// @flow
import React from 'react';
import type { HTMLElement } from 'types';

import styles from './block.css';

type Props = {
  title: string,
  children: HTMLElement,
}

const Block = (props: Props) => {
  return (
    <div styleName="block">
      <div styleName="header">{props.title}</div>
      <div>{props.children}</div>
    </div>
  )
};

export default Block;
