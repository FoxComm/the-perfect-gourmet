/* @flow */

// libs
import React, { Component } from 'react';
import { connect } from 'react-redux';

// styles
import styles from './delivery.css';

const ViewDelivery = (props) => {
  const { shippingMethod } = props;

  if (!shippingMethod) return <div></div>;

  return (
    <div styleName="selected">
      <div styleName="name">{shippingMethod.name}</div>
      <div styleName="price">{props.shippingMethodCost(shippingMethod.price)}</div>
    </div>
  );
};

export default connect(state => state.cart)(ViewDelivery);