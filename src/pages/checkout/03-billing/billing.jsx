/* @flow weak */

// libs
import React from 'react';
import { connect } from 'react-redux';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import EditBilling from './edit-billing';
import ViewBilling from './view-billing';

// styles
import styles from '../checkout.css';

// types
import type { CheckoutBlockProps } from '../types';
import type { BillingData } from 'modules/checkout';

const Billing = (props: CheckoutBlockProps) => {
  const billingData: BillingData = props.creditCard ? props.creditCard : props.billingData;

  const content = props.isEditing
    ? <EditBilling {...props} />
    : <ViewBilling billingData={billingData} />;

  const billingContent = (
    <div styleName="checkout-block-content">
      {content}
    </div>
  );

  const { t } = props;

  return (
    <EditableBlock
      {...props}
      styleName="checkout-block"
      title={t('BILLING')}
      content={billingContent}
    />
  );
};

export default connect(state => ({
  billingData: state.checkout.billingData,
  creditCard: state.cart.creditCard,
}))(localized(Billing));
