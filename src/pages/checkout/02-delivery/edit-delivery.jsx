/* @flow */

// libs
import _ from 'lodash';
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import localized from 'lib/i18n';

// components
import Radiobutton from 'ui/radiobutton/radiobutton';
import Loader from 'ui/loader';
import CheckoutForm from '../checkout-form';

// styles
import styles from './delivery.css';

// actions
import * as cartActions from 'modules/cart';
import { fetchShippingMethods } from 'modules/checkout';

type Props = {
  continueAction: Function,
  shippingMethods: Array<any>,
  selectedShippingMethod: Object,
  fetchShippingMethods: Function,
  shippingMethodCost: Function,
  isLoading: boolean,
  error: ?Array<any>,
};

class EditDelivery extends Component {
  props: Props;

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
      const cost = this.props.shippingMethodCost(shippingMethod.price);
      const checked = selectedMethod && selectedMethod.id == shippingMethod.id;

      return (
        <div key={shippingMethod.id} styleName="shipping-method">
          <Radiobutton
            name="delivery"
            checked={checked || false}
            onChange={() => selectShippingMethod(shippingMethod)}
            id={`delivery${shippingMethod.id}`}
          >
            {shippingMethod.name}
          </Radiobutton>
          <div styleName="price">{cost}</div>
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

function mapStateToProps(state) {
  return {
    shippingMethods: state.checkout.shippingMethods,
    selectedShippingMethod: state.cart.shippingMethod,
    isLoading: _.get(state.asyncActions, ['shippingMethods', 'inProgress'], true),
  };
}

export default connect(mapStateToProps, {...cartActions, fetchShippingMethods})(localized(EditDelivery));
