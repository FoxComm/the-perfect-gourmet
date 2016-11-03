
import React from 'react';

import Block from '../common/block';
import { SecondaryButton } from 'ui/buttons';

type Props = {
}

const Details = (props: Props) => {
  return (
    <Block title="My Details">
      <dl>
        <dt>First and last name</dt>
        <dd>Bree Swineford</dd>
        <dt>Email</dt>
        <dd>bree@foxcommerce.com</dd>
      </dl>
      <SecondaryButton>CHANGE PASSWORD</SecondaryButton>
    </Block>
  );
};

export default Details;
