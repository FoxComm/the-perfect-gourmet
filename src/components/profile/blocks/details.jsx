
import React from 'react';

import Block from '../common/block';
import Button from 'ui/buttons';

import profileStyles from '../profile.css';
import detailsStyles from './details.css';

const styles = {...profileStyles, ...detailsStyles};

const Details = () => {
  return (
    <Block title="My Details">
      <div styleName="section">
        <div styleName="line">
          <div styleName="subtitle">First and last name</div>
          <div>EDIT</div>
        </div>
        <div>Bree Swineford</div>
      </div>
      <div styleName="section">
        <div styleName="line">
          <div styleName="subtitle">Email</div>
          <div>EDIT</div>
        </div>
        <div>bree@foxcommerce.com</div>
      </div>
      <Button styleName="button">CHANGE PASSWORD</Button>
    </Block>
  );
};

export default Details;
