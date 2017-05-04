/* @flow */
import React from 'react';

import styles from './site.css';

type Props = {
  children: any,
};

const Site = (props: Props) => {
  return (
    <div styleName="site">
      {props.children}
    </div>
  );
};

export default Site;
