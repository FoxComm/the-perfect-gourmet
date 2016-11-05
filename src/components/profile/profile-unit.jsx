// @flow

import React from 'react';
import styles from './profile.css';

import Breadcrumb from './breadcrumb';

import type { HTMLElement } from 'types';

type Route = {
  component: {
    title?: string,
  },
}

type Props = {
  children: HTMLElement|Array<HTMLElement>,
  routes: Array<Route>,
}

const ProfileUnit = (props: Props) => {
  const lastRoute = props.routes[props.routes.length - 1];
  return (
    <div styleName="profile">
      <Breadcrumb title={lastRoute.component.title} />
      {props.children}
    </div>
  );
};

export default ProfileUnit;
