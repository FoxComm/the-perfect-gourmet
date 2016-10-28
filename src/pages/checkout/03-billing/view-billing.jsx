/* @flow weak */

import _ from 'lodash';
import React from 'react';
import styles from '../checkout.css';
import { connect } from 'react-redux';

// components
import Icon from 'ui/icon';
import ViewAddress from '../address/view-address';

import type { BillingData } from 'modules/checkout';

const ViewBilling = (props) => {
  const billingData: BillingData = props.creditCard ? props.creditCard : props.billingData;

  const paymentType = billingData.brand ? _.kebabCase(billingData.brand) : '';

  const lastTwoYear = billingData.expYear && billingData.expYear.toString().slice(-2);
  const monthYear = billingData.expMonth || billingData.expYear ?
    <span>{billingData.expMonth}/{lastTwoYear}</span> : null;
  const addressInfo = !_.isEmpty(props.billingAddress) ?
    <ViewAddress styleName="billing-address" {...props.billingAddress} /> : null;

  return (
    <div>
      {paymentType && <Icon styleName="payment-icon" name={`fc-payment-${paymentType}`} />}
      <div styleName="payment-card-info">
        <span styleName="payment-last-four">•••• {billingData.lastFour}</span>
        {monthYear}
      </div>
      {addressInfo}
    </div>
  );
};

export default connect(state => ({
  billingData: state.checkout.billingData,
  creditCard: state.cart.creditCard,
}))(ViewBilling);
