/* @flow */

import React, { Element } from 'react';
import styles from './related-list-item.css';
import { Link } from 'react-router';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { addLineItem, toggleCart } from 'modules/cart';
import { connect } from 'react-redux';

import * as tracking from 'lib/analytics';

import SmallAddToCartBtn from 'ui/add-to-cart-btn/small-add-to-cart-btn';
import ImagePlaceholder from '../products-item/image-placeholder';
import ProductImage from '../imgix/product-image';
import { Currency } from '@foxcomm/storefront-react/tpg';


type Image = {
  alt?: string,
  src: string,
  title?: string,
  baseurl?: string,
};

type Album = {
  name: string,
  images: Array<Image>,
};

type Product = {
  id: number,
  index: number,
  productId: number,
  slug: ?string,
  context: string,
  title: string,
  description: ?string,
  salePrice: string,
  retailPrice: string,
  currency: string,
  albums: ?Array<Album> | Object,
  skus: Array<string>,
  tags?: Array<string>,
  addLineItem: Function,
  toggleCart: Function,
};

type State = {
  error?: any,
};

class RelatedListItem extends React.Component {
  props: Product;
  state: State;

  static defaultProps = {
    skus: [],
  };

  @autobind
  addToCart() {
    const skuId = this.props.skus[0];
    const quantity = 1;

    tracking.addToCart(this.props, quantity);
    this.props.addLineItem(skuId, quantity)
      .then(() => {
        this.props.toggleCart();
      })
      .catch((ex) => {
        this.setState({
          error: ex,
        });
      });
  }

  get image() {
    const previewImageUrl = _.get(this.props.albums, [0, 'images', 0, 'src']);

    return previewImageUrl
      ? <ProductImage src={previewImageUrl} styleName="preview-image" ref="image" />
      : <ImagePlaceholder ref="image" />;
  }

  @autobind
  handleClick() {
    const { props } = this;
    tracking.clickPdp(props, props.index);
  }

  isOnSale(): Element<*> {
    const { currency } = this.props;

    let {
      salePrice,
      retailPrice,
    } = this.props;

    salePrice = Number(salePrice);
    retailPrice = Number(retailPrice);

    return (retailPrice > salePrice) ? (
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
          <Currency value={salePrice} currency={currency} />
        </div>
      );
  }

  render(): Element<*> {
    const {
      productId,
      slug,
      title,
    } = this.props;

    const productSlug = !slug ? productId : slug;

    return (
      <div styleName="list-item">
        <Link onClick={this.handleClick} to={`/products/${productSlug}`}>
          <div styleName="preview">
            {this.image}
          </div>
        </Link>

        <div styleName="text-block">
          <h1 styleName="title">
            <Link to={`/products/${productSlug}`}>{title}</Link>
          </h1>
          <div styleName="price-line">
            {this.isOnSale()}
            <div styleName="add-to-cart-btn">
              <SmallAddToCartBtn onClick={this.addToCart} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  addLineItem,
  toggleCart,
})(RelatedListItem);
