
/* @flow weak */

import React from 'react';
import type { Address } from 'types/address';

type Props = Address & {
  className?: string,
};

const ViewAddress = (props: Props) => {
  return (
    <ul className={props.className}>
      <li><strong>{props.name}</strong></li>
      <li>{props.address1}</li>
      {props.address2 && <li>{props.address2}</li>}
      <li>{props.city}, {props.zip}</li>
      {props.phoneNumber && <li>{props.phoneNumber}</li>}
    </ul>
  );
};

export default ViewAddress;
