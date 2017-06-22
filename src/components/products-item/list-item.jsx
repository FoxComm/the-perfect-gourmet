/* @flow */

import React, { Element } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './list-item.css';
import { Link } from 'react-router';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { addLineItem, toggleCart } from 'modules/cart';
import { connect } from 'react-redux';
import * as tracking from 'lib/analytics';

import AddToCartBtn from 'ui/add-to-cart-btn';
import ImagePlaceholder from './image-placeholder';
import ProductImage from '../imgix/product-image';

import { Currency } from '@foxcomm/storefront-react';

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
  amountOfServings: ?string,
  servingSize: ?string,
  salePrice: string,
  retailPrice: string,
  currency: string,
  albums: ?Array<Album> | Object,
  skus: Array<string>,
  tags?: Array<string>,
  addLineItem: Function,
  toggleCart: Function,
  showAddToCartButton: boolean,
  showServings: boolean,
  showDescriptionOnHover: boolean,
  size: ?string,
};

type State = {
  error?: any,
};

class ListItem extends React.Component {
  props: Product;
  state: State;

  static defaultProps = {
    skus: [],
    showAddToCartButton: true,
    showServings: false,
    showDescriptionOnHover: true,
    size: '',
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
      .catch(ex => {
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

  getImageNode() {
    return findDOMNode(this.refs.image);
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

  servings(): ?Element<*> {
    const {
      showServings,
      amountOfServings,
      servingSize,
    } = this.props;

    if (!showServings) return null;

    return (
      <div styleName="servings">
        <div>{amountOfServings}</div>
        <div>{servingSize}</div>
      </div>
    );
  }

  hoverInfo(description): ?Element<*> {
    const { showDescriptionOnHover } = this.props;

    if (!showDescriptionOnHover) return null;

    return (
      <div styleName="hover-info">
        <h2
          styleName="additional-description"
          dangerouslySetInnerHTML={{__html: description}}
        />
      </div>
    );
  }

  addToCartButton(): ?Element<*> {
    const { showAddToCartButton } = this.props;

    if (!showAddToCartButton) return null;

    return (
      <div styleName="add-to-cart-btn">
        <AddToCartBtn onClick={this.addToCart} expanded />
      </div>
    );
  }

  render(): Element<*> {
    const {
      productId,
      slug,
      title,
      description,
      size,
    } = this.props;

    const productSlug = slug != null && !_.isEmpty(slug) ? slug : productId;
    const listItemStyleName = size ? `list-item-${size}` : 'list-item';
    const titleStyleName = size ? `title-${size}` : 'title';

    return (
      <div styleName={listItemStyleName}>
        <Link onClick={this.handleClick} to={`/products/${productSlug}`}>
          <div styleName="preview">
            {this.image}
            {this.hoverInfo(description)}
          </div>
        </Link>

        <div styleName="text-block">
          <h1 styleName={titleStyleName} alt={title}>
            <Link to={`/products/${productSlug}`}>{title}</Link>
          </h1>
          <h2 styleName="description">{/* serving size */}</h2>
          {this.servings()}
          <div styleName="price-line">
            {this.isOnSale()}
            {this.addToCartButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  addLineItem,
  toggleCart,
}, void 0, { withRef: true })(ListItem);
