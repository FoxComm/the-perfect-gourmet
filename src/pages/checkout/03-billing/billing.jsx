/* @flow weak */

import React from 'react';
import styles from '../checkout.css';

import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import EditBilling from './edit-billing';
import ViewBilling from './view-billing';

import type { CheckoutBlockProps } from '../types';

const Billing = (props: CheckoutBlockProps) => {
  const content = props.isEditing
    ? <EditBilling {...props} />
    : <ViewBilling />;

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

export default localized(Billing);
