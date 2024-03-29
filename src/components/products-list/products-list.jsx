/* @flow weak */

// libs
import _ from 'lodash';
import React, { Component, Element } from 'react';
import { autobind, debounce } from 'core-decorators';
import { isElementInViewport } from 'lib/dom-utils';
import * as tracking from 'lib/analytics';

// styles
import styles from './products-list.css';

// components
import ListItem from '../products-item/list-item';
import { WaitAnimation } from '@foxcomm/storefront-react/tpg';

// types

export const LoadingBehaviors = {
  ShowLoader: 0,
  ShowWrapper: 1,
};

type Props = {
  loadingBehavior?: 0|1,
  list: ?Array<Object>,
  isLoading: ?boolean,
  title: ?string,
  size: ?string,
  showAddToCartButton: ?boolean,
  showServings: ?boolean,
  showDescriptionOnHover: ?boolean,
};

type State = {
  shownProducts: {[productId: string]: number},
}

class ProductsList extends Component {
  props: Props;
  state: State = {
    shownProducts: {},
  };
  _willUnmount: boolean = false;

  static defaultProps = {
    size: '',
    showAddToCartButton: true,
    showServings: false,
    showDescriptionOnHover: true,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this._willUnmount = true;
    window.removeEventListener('scroll', this.handleScroll);
  }

  @autobind
  @debounce(100)
  handleScroll() {
    if (this._willUnmount) return;
    this.trackProductView();
  }

  @autobind
  renderProduct(item, index) {
    const {
      size,
      showAddToCartButton,
      showServings,
      showDescriptionOnHover,
    } = this.props;

    return (
      <ListItem
        {...item}
        index={index}
        key={`product-${item.id}`}
        ref={`product-${item.id}`}
        size={size}
        showAddToCartButton={showAddToCartButton}
        showServings={showServings}
        showDescriptionOnHover={showDescriptionOnHover}
      />
    );
  }

  renderProducts() {
    return _.map(this.props.list, this.renderProduct);
  }

  trackProductView() {
    if (this.props.isLoading) return;

    const visibleProducts = this.getNewVisibleProducts();
    const shownProducts = {};

    if (visibleProducts.length > 0) {
      _.each(visibleProducts, (item) => {
        shownProducts[item.id] = 1;
        tracking.addImpression(item, item.index);
      });
      tracking.sendImpressions();
      this.setState({
        shownProducts: {
          ...this.state.shownProducts,
          ...shownProducts,
        },
      });
    }
  }

  getNewVisibleProducts() {
    const { props } = this;
    let visibleProducts = [];
    const { shownProducts } = this.state;

    const products = _.get(props, 'list', []);

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      if (item.id in shownProducts) continue;

      const node = this.refs[`product-${item.id}`].getWrappedInstance().getImageNode();
      if (node) {
        if (isElementInViewport(node)) {
          visibleProducts = [...visibleProducts, {...item, index: i}];
        }
      }
    }

    return visibleProducts;
  }

  @autobind
  handleListRendered() {
    setTimeout(() => {
      if (!this._willUnmount) this.trackProductView();
    }, 250);
  }

  get loadingWrapper(): ?Element<*> {
    if (this.props.isLoading) {
      return (
        <div styleName="loading-wrapper">
          <div styleName="loader">
            <WaitAnimation />
          </div>
        </div>
      );
    }
  }

  get title(): ?Element<*> {
    const { title } = this.props;

    if (!title) return null;

    return (
      <div styleName="title">
        {title}
      </div>
    );
  }

  render() : Element<any> {
    const {
      loadingBehavior = LoadingBehaviors.ShowLoader,
      isLoading,
      list,
      size,
    } = this.props;

    if (loadingBehavior == LoadingBehaviors.ShowLoader && isLoading) {
      return <WaitAnimation />;
    }

    const items = list && list.length > 0
      ? this.renderProducts()
      : <div styleName="not-found">No products found.</div>;

    const listWrapperStyleName = size ? `list-wrapper-${size}` : 'list-wrapper';

    return (
      <div styleName={listWrapperStyleName}>
        {this.loadingWrapper}
        {this.title}
        <div styleName="list" ref={this.handleListRendered}>
          {items}
        </div>
      </div>
    );
  }
}

export default ProductsList;
