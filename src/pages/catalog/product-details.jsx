/* @flow */

// libs
import _ from 'lodash';
import React, { Element } from 'react';

// components
import { Currency, Select } from '@foxcomm/storefront-react';
import AddToCartBtn from 'ui/add-to-cart-btn';

// types

// styles
import styles from './pdp.css';

const QUANTITY_ITEMS = _.range(1, 1 + 10, 1);

type Props = {
  product: Object,
  children: Element<*>,
  quantity: number,
  onQuantityChange: Function,
  addToCart: Function,
  className?: string,
};

const ProductDetails = (props: Props) => {
  const {
    title,
    currency,
    price,
    skus,
  } = props.product;

  const salePrice = _.get(skus[0], 'attributes.salePrice.v.value', 0);
  const retailPrice = _.get(skus[0], 'attributes.retailPrice.v.value', 0);

  const isOnSale = (retailPrice > salePrice) ? (
    <div styleName="price">
      <Currency
        styleName="retail-price"
        value={retailPrice}
        currency={currency}
      />
      <Currency
        styleName="on-sale-price"
        value={salePrice}
        currency={currency}
      />
    </div>
    ) : (
      <div styleName="price">
        <Currency value={price} currency={currency} />
      </div>
    );


  return (
    <div className={props.className}>
      <div styleName="main">
        <h1 styleName="title">{title}</h1>

        {isOnSale}

        <div styleName="cart-actions">
          <div styleName="quantity">
            <Select
              inputProps={{
                type: 'number',
              }}
              getItemValue={_.identity}
              items={QUANTITY_ITEMS}
              onSelect={props.onQuantityChange}
              selectedItem={props.quantity}
              sortItems={false}
            />
          </div>

          <div styleName="add-to-cart-btn">
            <AddToCartBtn
              pdp
              expanded
              onClick={props.addToCart}
            />
          </div>
        </div>
      </div>

      {props.children}

    </div>
  );
};

export default ProductDetails;
