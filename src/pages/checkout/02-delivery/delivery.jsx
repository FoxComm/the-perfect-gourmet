/* @flow */

// libs
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import localized from 'lib/i18n';

// components
import EditableBlock from 'ui/editable-block';
import { Currency } from '@foxcomm/storefront-react';
import EditDelivery from './edit-delivery';
import ViewDelivery from './view-delivery';
import { Link } from 'react-router';

// styles
import styles from './delivery.css';

// types
import type { CheckoutBlockProps } from '../types';

class Delivery extends Component {
  props: CheckoutBlockProps;

  @autobind
  shippingMethodCost(cost) {
    const { t } = this.props;

    return cost == 0
      ? <div styleName="delivery-cost">{t('FREE')}</div>
      : <Currency styleName="delivery-cost" value={cost} />;
  }

  @autobind
  renderContent() {
    if (this.props.isEditing) {
      return (
        <EditDelivery {...this.props} shippingMethodCost={this.shippingMethodCost} />
      );
    }

    return (
      <ViewDelivery
        shippingMethodCost={this.shippingMethodCost}
        shippingMethod={this.props.shippingMethod}
      />
    );
  }

  get footnote() {
    return (
      <Link to="/shipping-and-returns">SHIPPING & RETURNS POLICY</Link>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <EditableBlock
        isEditing={this.props.isEditing}
        editAction={this.props.editAction}
        editAllowed={this.props.editAllowed}
        styleName="delivery"
        title={t('DELIVERY')}
        content={this.renderContent()}
        footnote={this.footnote}
      />
    );
  }
}

export default localized(Delivery);
