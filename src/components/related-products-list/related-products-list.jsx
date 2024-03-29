/* @flow weak */

// libs
import _ from 'lodash';
import React, { Component, Element } from 'react';

// styles
import styles from './related-products-list.css';

// components
import { WaitAnimation } from '@foxcomm/storefront-react/tpg';
import RelatedListItem from '../related-products-item/related-list-item';

// types

export const LoadingBehaviors = {
  ShowLoader: 0,
  ShowWrapper: 1,
};

type Props = {
  loadingBehavior?: 0|1,
  list: ?Array<Object>,
  isLoading: ?boolean,
  title: string,
};

class RelatedProductsList extends Component {
  props: Props;
  _willUnmount: boolean = false;

  get renderProducts() {
    const { list } = this.props;

    if (_.isEmpty(list)) return null;

    return _.map(list, (item, index) => {
      const prod = item.product;
      return (
        <RelatedListItem
          {...prod}
          index={index}
          key={`product-${prod.id}`}
          ref={`product-${prod.id}`}
        />
      );
    });
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

  render(): Element<any>|null {
    const { loadingBehavior = LoadingBehaviors.ShowLoader, isLoading, list, title } = this.props;

    if (loadingBehavior == LoadingBehaviors.ShowLoader && isLoading) {
      return <WaitAnimation />;
    }

    if (_.isEmpty(list)) return null;

    return (
      <div styleName="list-wrapper">
        {this.loadingWrapper}
        <div styleName="related-title">
          {title}
        </div>
        <div styleName="line" />
        <div styleName="list">
          {this.renderProducts}
        </div>
      </div>
    );
  }
}

export default RelatedProductsList;
