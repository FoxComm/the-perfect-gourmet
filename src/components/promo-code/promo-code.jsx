/* @flow */

// libs
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import sanitizePromoErrors from 'sanitizers/promocodes';

// components
import { TextInput } from 'components/core/inputs';
import Button from 'components/core/buttons';
import { FormField } from 'components/core/forms';
import ErrorAlerts from '@foxcomm/wings/lib/ui/alerts/error-alerts';
import { Currency, Icon } from '@foxcomm/storefront-react/tpg';

// styles
import styles from './promo-code.css';

type Props = {
  saveCode: Function,
  removeCode: Function,
  buttonLabel?: ?string,
  coupon?: ?Object,
  giftCards?: ?Array<Object>,
  promotion?: ?Object,
  discountValue?: ?number,
  allowDelete?: ?boolean,
  disabled?: boolean,
  placeholder?: string,
  context: string,
  editable: boolean,
};

type State = {
  code: string,
  error: any,
};

class PromoCode extends Component {
  props: Props;

  static defaultProps = {
    allowDelete: true,
    saveCode: _.noop,
    removeCode: _.noop,
    disabled: false,
    context: 'light',
    editable: true,
  };

  state: State = {
    code: '', // input value
    error: false,
  };

  get buttonLabel(): string {
    return this.props.buttonLabel || 'Apply';
  }

  @autobind
  changeCode({ target }: Object) {
    this.setState({
      code: target.value,
      error: false,
    });
  }

  @autobind
  onKeyPress(e: Object) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.saveCode();
    }
  }

  @autobind
  saveCode() {
    const code = this.state.code.replace(/\s+/g, '');

    this.props.saveCode(code)
      .then(() => this.setState({ code: '', error: false }))
      .catch((error) => {
        this.setState({ error });
      });
  }

  removeCode(code?: string) {
    this.props.removeCode(code)
      .catch((error) => {
        this.setState({ error });
      });
  }

  renderGiftCard(card: Object) {
    const { code, amount: discountValue, currentBalance } = card;

    return (
      <div styleName="gift-card" key={card.code}>
        <div styleName="gift-card-description">
          <div styleName="gift-card-title">{`Gift Card ${code}`}</div>
          <Currency styleName="gift-card-curr" prefix={'Current Balance: '} value={currentBalance} />
        </div>
        <Currency styleName="subtotal-price" value={discountValue} prefix={'– '} />

        {this.props.allowDelete &&
          <Icon
            onClick={() => this.removeCode(code)}
            name="close"
            styleName="delete-promo-btn"
          />
        }
      </div>
    );
  }

  renderAttachedCoupon() {
    if (this.props.coupon) {
      const promoCode = _.get(this.props, 'coupon.code');
      const discountValue = this.props.discountValue;

      return (
        <div styleName="coupon">
          <div styleName="coupon-code">{promoCode}</div>
          <Currency styleName="subtotal-price" value={discountValue} prefix={'– '} />

          {this.props.allowDelete &&
            <Icon
              name="close"
              styleName="delete-promo-btn"
              onClick={() => this.removeCode()}
            />
          }
        </div>
      );
    }

    if (this.props.giftCards) {
      return this.props.giftCards.map(card => this.renderGiftCard(card));
    }

    return null;
  }

  render() {
    const { placeholder, context, editable } = this.props;

    return (
      <div styleName="root" className={styles[context]}>
        {editable &&
          <div styleName="fieldset">
            <FormField styleName="code-field">
              <TextInput
                styleName="code"
                placeholder={placeholder}
                value={this.state.code}
                onChange={this.changeCode}
                onKeyPress={this.onKeyPress}
              />
            </FormField>
            <Button
              type="button"
              styleName="submit"
              onClick={this.saveCode}
              disabled={this.props.disabled || !this.state.code}
            >
              {this.buttonLabel}
            </Button>
          </div>
        }

        {!!this.state.error &&
          <div styleName="error">
            <ErrorAlerts
              error={this.state.error}
              sanitizeError={sanitizePromoErrors}
            />
          </div>
        }

        {this.renderAttachedCoupon()}
      </div>
    );
  }
}

export default PromoCode;
