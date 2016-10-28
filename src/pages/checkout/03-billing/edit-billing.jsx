/* @flow weak */

import _ from 'lodash';
import React, { Component } from 'react';
import styles from '../checkout.css';
import textStyles from 'ui/css/input.css';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { cardMask } from 'wings/lib/payment-cards';

import localized from 'lib/i18n';
import { api as foxApi } from 'lib/api';

import { Form, FormField } from 'ui/forms';
import { TextInput, TextInputWithLabel } from 'ui/inputs';
import Button from 'ui/buttons';
import Checkbox from 'ui/checkbox/checkbox';
import EditableBlock from 'ui/editable-block';
import Autocomplete from 'ui/autocomplete';
import InputMask from 'react-input-mask';
import EditAddress from '../address/edit-address';
import CreditCards from './credit-cards';
import Icon from 'ui/icon';
import CvcHelp from './cvc-help';
import ErrorAlerts from 'wings/lib/ui/alerts/error-alerts';
import GiftCard from './gift-card';
import CouponCode from '../../../components/coupon-code/coupon-code';


import * as cartActions from 'modules/cart';
import * as checkoutActions from 'modules/checkout';
import { AddressKind } from 'modules/checkout';

function mapStateToProps(state) {
  return {
    data: state.checkout.billingData,
    billingAddressIsSame: state.checkout.billingAddressIsSame,
  };
}

const months = _.range(1, 13, 1).map(x => _.padStart(x.toString(), 2, '0'));
const currentYear = new Date().getFullYear();
const years = _.range(currentYear, currentYear + 10, 1).map(x => x.toString());

type State = {
  addingNew: boolean,
};

class EditBilling extends Component {

  state: State = {
    addingNew: false,
  };

  @autobind
  handleSubmit() {
    this.props.continueAction();
  }

  @autobind
  changeFormData({ target }) {
    this.props.setBillingData(target.name, target.value);
  }

  @autobind
  changeCVC({ target }) {
    const value = target.value.replace(/[^\d]/g, '').substr(0, target.maxLength);
    this.props.setBillingData('cvc', value);
  }

  @autobind
  changeCardNumber({ target }) {
    const value = target.value.replace(/[^\d]/g, '');

    this.props.setBillingData('number', value);
    this.props.setBillingData('brand', foxApi.creditCards.cardType(value));
    this.props.setBillingData('lastFour', value.substr(-4));
  }

  @autobind
  changeMonth(month) {
    this.props.setBillingData('expMonth', month);
  }

  @autobind
  changeYear(year) {
    this.props.setBillingData('expYear', year);
  }

  get billingAddress() {
    const { billingAddressIsSame } = this.props;

    if (billingAddressIsSame) {
      return null;
    }

    return <EditAddress addressKind={AddressKind.BILLING} {...this.props} />;
  }

  get cardType() {
    const { number } = this.props.data;
    return _.kebabCase(foxApi.creditCards.cardType(number));
  }

  get cardMask() {
    return cardMask(this.cardType);
  }

  get paymentIcon() {
    if (this.cardType) {
      return <Icon styleName="payment-icon" name={`fc-payment-${this.cardType}`} />;
    }
  }

  @autobind
  validateCardNumber() {
    const { number } = this.props.data;
    const { t } = this.props;

    return foxApi.creditCards.validateCardNumber(number) ? null : t('Please enter a valid credit card number');
  }

  @autobind
  validateCvcNumber() {
    const { cvc } = this.props.data;
    const { t } = this.props;

    return foxApi.creditCards.validateCVC(cvc) ? null : t(`Please enter a valid cvc number`);
  }

  get cvcHelp() {
    return <CvcHelp />;
  }

  @autobind
  addNew() {
    this.props.resetCreditCard();
    this.setState({ addingNew: true });
  }

  @autobind
  selectCreditCard(creditCard) {
    this.props.selectCreditCard(creditCard);
    this.setState({ addingNew: false });
  }

  get form() {
    const { props } = this;
    const { data, inProgress, t } = props;

    return (
      <div>
        <div>{t('NEW CREDIT CARD')}</div>
        <Form onSubmit={this.props.addCreditCard} styleName="checkout-form">
          <FormField styleName="text-field">
            <TextInput
              required
              name="holderName"
              placeholder={t('NAME ON CARD')}
              value={data.holderName}
              onChange={this.changeFormData}
            />
          </FormField>
          <div styleName="union-fields">
            <FormField styleName="text-field" validator={this.validateCardNumber}>
              <TextInputWithLabel
                label={this.paymentIcon}
              >
                <InputMask
                  required
                  styleName="payment-input"
                  className={textStyles['text-input']}
                  maskChar=" "
                  type="text"
                  mask={this.cardMask}
                  name="number"
                  placeholder={t('CARD NUMBER')}
                  size="20"
                  value={data.number}
                  onChange={this.changeCardNumber}
                />
              </TextInputWithLabel>
            </FormField>
            <FormField styleName="text-field" validator={this.validateCvcNumber}>
              <TextInputWithLabel
                required
                label={this.cvcHelp}
                type="number"
                maxLength="4"
                placeholder={t('CVC')}
                onChange={this.changeCVC}
                value={data.cvc}
              />
            </FormField>
          </div>
          <div styleName="union-fields">
            <FormField required styleName="text-field" getTargetValue={() => data.expMonth}>
              <Autocomplete
                inputProps={{
                  placeholder: t('MONTH'),
                  type: 'text',
                }}
                compareValues={(value1, value2) => Number(value1) == Number(value2)}
                getItemValue={item => item}
                items={months}
                onSelect={this.changeMonth}
                selectedItem={data.expMonth}
              />
            </FormField>
            <FormField required styleName="text-field" getTargetValue={() => data.expYear}>
              <Autocomplete
                inputProps={{
                  placeholder: t('YEAR'),
                  type: 'number',
                }}
                allowCustomValues
                getItemValue={item => item}
                items={years}
                onSelect={this.changeYear}
                selectedItem={data.expYear}
              />
            </FormField>
          </div>
          <Checkbox
            id="billingAddressIsSame"
            checked={props.billingAddressIsSame}
            onChange={props.toggleSeparateBillingAddress}
          >
            {t('Billing address is same as shipping')}
          </Checkbox>
          {this.billingAddress}
          <ErrorAlerts error={this.props.error} />
          <Button isLoading={inProgress} styleName="checkout-submit" type="submit">{t('Add Card')}</Button>
        </Form>
      </div>
    );
  }

  render() {
    const { inProgress, t } = this.props;

    let form;

    if (this.state.addingNew) {
      form = this.form;
    } else {
      form = (
        <Button isLoading={inProgress} styleName="checkout-submit" onClick={this.handleSubmit}>
          {t('PLACE ORDER')}
        </Button>
      );
    }


    return (
      <div>
        <div styleName="credit-cards-title">
          <div>{t('SELECT CREDIT CARD')}</div>
          <div onClick={this.addNew} styleName="credit-card-add">{t('ADD')}</div>
        </div>
        <CreditCards selectCreditCard={this.selectCreditCard} />
        {form}

        <EditableBlock
          styleName="checkout-block"
          title="PROMO CODE"
          isEditing
          collapsed={false}
          content={<CouponCode />}
        />
        <GiftCard />
      </div>
    );
  }
}

export default connect(mapStateToProps, { ...checkoutActions, ...cartActions })(localized(EditBilling));
