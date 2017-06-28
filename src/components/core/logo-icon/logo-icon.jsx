import React, { Element } from 'react';
import classnames from 'classnames';

import { Icon } from '@foxcomm/storefront-react/tpg';

import s from './logo-icon.css';

type Props = {
  className?: string,
}

const LogoIcon = ({className}: Props) => {
  return (
    <Icon className={classnames(s.block, className)} name="logo" prefix="tpg-icon-" />
  );
};

export default LogoIcon;
