/* @flow */

// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import localized from 'lib/i18n';

// components
import Radiobutton from 'ui/radiobutton/radiobutton';
import EditableBlock from 'ui/editable-block';
import Currency from 'ui/currency';
import Loader from 'ui/loader';
import CheckoutForm from '../checkout-form';

// styles
import styles from './delivery.css';

// actions
import * as cartActions from 'modules/cart';
import { fetchShippingMethods } from 'modules/checkout';

//types
import type { CheckoutBlockProps } from '../types';

const shippingMethodCost = (t, cost) => {
  return cost == 0
    ? <div styleName="delivery-cost">{t('FREE')}</div>
    : <Currency styleName="delivery-cost" value={cost}/>;
};

let ViewDelivery = (props) => {
  const { shippingMethod } = props;

  if (!shippingMethod) return <div></div>;

  return (
    <div styleName="shipping-method">
      <div>{shippingMethod.name}</div>
      {shippingMethodCost(props.t, shippingMethod.price)}
    </div>
  );
};
ViewDelivery = connect(state => state.cart)(localized(ViewDelivery));

function mapStateToProps(state) {
  return {
    shippingMethods: state.checkout.shippingMethods,
    selectedShippingMethod: state.cart.shippingMethod,
    isLoading: _.get(state.asyncActions, ['shippingMethods', 'inProgress'], true),
  };
}

/* ::`*/
@connect(mapStateToProps, {...cartActions, fetchShippingMethods})
@localized
/* ::`*/
class EditDelivery extends Component {

  componentWillMount() {
    this.props.fetchShippingMethods();
  }

  @autobind
  handleSubmit() {
    const { selectedShippingMethod: selectedMethod } = this.props;
    if (selectedMethod) {
      this.props.continueAction();
    }
  }

  get shippingMethods() {
    const { shippingMethods, selectedShippingMethod: selectedMethod, selectShippingMethod, t } = this.props;

    return shippingMethods.map(shippingMethod => {
      const cost = shippingMethodCost(t, shippingMethod.price);
      const checked = selectedMethod && selectedMethod.id == shippingMethod.id;

      return (
        <div key={shippingMethod.id} styleName="shipping-method">
          <Radiobutton
            name="delivery"
            checked={checked}
            onChange={() => selectShippingMethod(shippingMethod)}
            id={`delivery${shippingMethod.id}`}
          >
            {shippingMethod.name}
          </Radiobutton>
          <div className="price">{cost}</div>
        </div>
      );
    });
  }

  render() {
    const { isLoading, t } = this.props;

    if (isLoading) {
      return <Loader size="m" />;
    }

    return (
      <CheckoutForm
        submit={this.handleSubmit}
        title="DELIVERY METHOD"
        error={this.props.error}
      >
        {this.shippingMethods}
      </CheckoutForm>
    );
  }
}

const Delivery = (props: CheckoutBlockProps) => {
  const content = (
    props.isEditing ? <EditDelivery {...props} /> : <ViewDelivery />
  );

  const { t } = props;

  return (
    <EditableBlock
      {...props}
      styleName="delivery"
      title={t('DELIVERY')}
      content={content}
    />
  );
};

export default localized(Delivery);
