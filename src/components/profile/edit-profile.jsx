// @flow

import React from 'react';
import styles from './profile.css';

import type { HTMLElement } from 'types';

type Props = {
  children: HTMLElement|Array<HTMLElement>,
}

const EditProfile = (props: Props) => {
  return (
    <div styleName="profile">
      {props.children}
    </div>
  );
};

export default EditProfile;
