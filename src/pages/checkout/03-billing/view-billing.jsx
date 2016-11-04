/* @flow weak */

// libs
import _ from 'lodash';
import React from 'react';

// components
import Icon from 'ui/icon';
import ViewAddress from '../address/view-address';

// styles
import styles from './credit-card.css';

// types
import type { BillingData } from 'modules/checkout';

type Props = {
  billingData: ?BillingData,
};

const ViewBilling = (props: Props) => {
  const { billingData } = props;

  if (!billingData || _.isEmpty(billingData)) return null;

  const { brand, expMonth, expYear, billingAddress, holderName, lastFour } = billingData;

  const paymentType = brand ? _.kebabCase(brand) : '';

  const lastTwoYear = expYear && expYear.toString().slice(-2);
  const monthYear = expMonth || expYear ?
    <li>{ expMonth }/{ lastTwoYear }</li> : null;
  const addressInfo = !_.isEmpty(billingAddress) ?
    <li><ViewAddress styleName="billing-address" {...billingAddress} /></li> : null;

  return (
    <ul styleName="view-billing">
      <li>{paymentType && <Icon styleName="payment-icon" name={`fc-payment-${paymentType}`} />}</li>
      <li styleName="payment-name">{ holderName }</li>
      <li styleName="payment-last-four">{ lastFour }</li>
      {monthYear}
      {addressInfo}
    </ul>
  );
};

export default ViewBilling;
