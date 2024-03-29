/* @flow */

// libs
import _ from 'lodash';
import React, { Component, Element } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { assoc } from 'sprout-data';
import * as tracking from 'lib/analytics';

// i18n
import localized from 'lib/i18n/index';
import type { Localized } from 'lib/i18n/index';

// modules
import { searchGiftCards } from 'modules/products';
import { fetch, getNextId, getPreviousId, resetProduct, clearErrors } from 'modules/product-details';
import { addLineItem, toggleCart } from 'modules/cart';
import { fetchRelatedProducts, clearRelatedProducts } from 'modules/cross-sell';

// types
import type { ProductResponse} from 'modules/product-details';
import type { RelatedProductResponse } from 'modules/cross-sell';

// components
import Gallery from 'components/core/gallery/gallery';
import { WaitAnimation } from '@foxcomm/storefront-react/tpg';
import ErrorAlerts from '@foxcomm/wings/lib/ui/alerts/error-alerts';
import ProductDetails from './product-details';
import GiftCardForm from '../gift-card-form/index';
import ProductAttributes from './product-attributes';
import ImagePlaceholder from '../products-item/image-placeholder';
import RelatedProductsList,
  { LoadingBehaviors } from '../related-products-list/related-products-list';

// styles
import styles from './pdp.css';

type Params = {
  productSlug: string,
};

type Actions = {
  fetch: (id: number) => any,
  getNextId: Function,
  getPreviousId: Function,
  resetProduct: Function,
  addLineItem: Function,
  toggleCart: Function,
  fetchRelatedProducts: Function,
  clearRelatedProducts: Function,
};

type Props = Localized & {
  actions: Actions,
  params: Params,
  product: ?ProductResponse,
  relatedProducts: ?RelatedProductResponse,
  isLoading: boolean,
  isCartLoading: boolean,
  notFound: boolean,
  fetchError: ?Object,
};

type State = {
  quantity: number,
  error?: any,
  currentSku?: any,
  attributes?: Object,
};

type Product = {
  title: string,
  description: string,
  images: Array<string>,
  currency: string,
  price: number|string,
  amountOfServings: string,
  servingSize: string,
  pathName: string,
};

const mapStateToProps = (state) => {
  const product = state.productDetails.product;
  const relatedProducts = state.crossSell.relatedProducts;

  return {
    product,
    relatedProducts,
    fetchError: _.get(state.asyncActions, 'pdp.err', null),
    notFound: !product && _.get(state.asyncActions, 'pdp.err.response.status') == 404,
    isLoading: _.get(state.asyncActions, ['pdp', 'inProgress'], true),
    isCartLoading: _.get(state.asyncActions, ['cartChange', 'inProgress'], false),
    isRelatedProductsLoading: _.get(state.asyncActions, ['relatedProducts', 'inProgress'], false),

  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    fetch,
    clearErrors,
    getNextId,
    getPreviousId,
    resetProduct,
    addLineItem,
    toggleCart,
    fetchRelatedProducts,
    clearRelatedProducts,
  }, dispatch),
});

class Pdp extends Component {
  props: Props;
  productPromise: Promise<*>;

  state: State = {
    quantity: 1,
    currentSku: null,
    attributes: {},
  };

  componentWillMount() {
    if (_.isEmpty(this.props.product) && !this.props.notFound && !this.props.fetchError) {
      this.productPromise = this.fetchProduct();
    } else {
      this.productPromise = Promise.resolve();
    }
  }

  componentDidMount() {
    this.productPromise.then(() => {
      const { product, isRelatedProductsLoading, actions } = this.props;

      tracking.viewDetails(this.product);
      if (!isRelatedProductsLoading) {
        actions.fetchRelatedProducts(product.id, 1).catch(_.noop);
      }
    });
  }

  componentWillUnmount() {
    this.props.actions.resetProduct();
    this.props.actions.clearErrors();
  }

  componentWillReceiveProps(nextProps: Props) {
    const id = this.getId(nextProps);

    if (this.productId !== id) {
      this.setState({ currentSku: null });
      this.props.actions.resetProduct();
      this.props.actions.clearRelatedProducts();
      this.fetchProduct(nextProps, id);
    }
  }

  safeFetch(id: string|number) {
    return this.props.actions.fetch(id)
      .then((product) => {
        this.props.actions.fetchRelatedProducts(product.id, 1).catch(_.noop);
      })
      .catch(() => {
        const { params } = this.props;
        this.props.actions.fetch(params.productSlug)
        .then((product) => {
          this.props.actions.fetchRelatedProducts(product.id, 1).catch(_.noop);
        })
        .catch(_.noop);
      });
  }

  fetchProduct(_props, _productId) {
    const props = _props || this.props;
    const productId = _productId || this.productId;

    if (this.isGiftCard(props)) {
      return searchGiftCards().then(({ result = [] }) => {
        const giftCard = result[0] || {};
        return this.safeFetch(giftCard.productId);
      });
    }
    return this.safeFetch(productId);
  }

  get productId(): string|number {
    return this.getId(this.props);
  }

  get isArchived(): boolean {
    return !!_.get(this.props, ['product', 'archivedAt']);
  }

  @autobind
  getId(props): string|number {
    const slug = props.params.productSlug;

    if (/^\d+$/g.test(slug)) {
      return parseInt(slug, 10);
    }

    return slug;
  }

  get currentSku() {
    return this.state.currentSku || this.sortedSkus[0];
  }

  get sortedSkus() {
    return _.sortBy(
      _.get(this.props, 'product.skus', []),
      'attributes.salePrice.v.value'
    );
  }

  @autobind
  setCurrentSku(currentSku) {
    this.setState({ currentSku });
  }

  @autobind
  setAttributeFromField({ target: { name, value } }) {
    const namePath = ['attributes', ...name.split('.')];
    const stateValue = name == 'giftCard.message' ? value.split('\n').join('<br>') : value;
    this.setState(assoc(this.state, namePath, stateValue));
  }

  get product(): Product {
    const attributes = _.get(this.props.product, 'attributes', {});
    const price = _.get(this.currentSku, 'attributes.salePrice.v', {});
    const images = _.get(this.props.product, ['albums', 0, 'images'], []);
    const imageUrls = images.map(image => image.src);

    return {
      title: _.get(attributes, 'title.v', ''),
      description: _.get(attributes, 'description.v', ''),
      images: imageUrls,
      currency: _.get(price, 'currency', 'USD'),
      price: _.get(price, 'value', 0),
      amountOfServings: _.get(attributes, 'Amount of Servings.v', ''),
      servingSize: _.get(attributes, 'Serving Size.v', ''),
      skus: this.sortedSkus,
      pathName: this.props.location.pathname,
    };
  }

  isGiftCard(props) {
    return (props || this.props).route.name === 'gift-cards';
  }

  @autobind
  changeQuantity(quantity: number): void {
    this.setState({ quantity });
  }

  @autobind
  addToCart(): void {
    const { actions } = this.props;
    const { quantity } = this.state;
    const skuId = _.get(this.currentSku, 'attributes.code.v', '');
    tracking.addToCart(this.product, quantity);
    actions.addLineItem(skuId, quantity, this.state.attributes)
      .then(() => {
        actions.toggleCart();
        this.setState({
          quantity: 1,
          attributes: {},
          currentSku: null,
        });
      })
      .catch((ex) => {
        this.setState({
          error: ex,
        });
      });
  }

  renderGallery() {
    const { images } = this.product;

    if (_.isEmpty(images)) {
      return (
        <ImagePlaceholder largeScreenOnly />
      );
    }

    return (
      <Gallery images={images} />
    );
  }

  get relatedProductsList() {
    const { relatedProducts, isRelatedProductsLoading } = this.props;

    const excludeId = this.productId;
    const filteredProducts = _.filter(relatedProducts.products,
      (p) => { return p.product.productId != excludeId; });

    if (_.size(filteredProducts) < 2) return null;

    return (
      <RelatedProductsList
        title="You May Also Enjoy"
        list={filteredProducts}
        isLoading={isRelatedProductsLoading}
        loadingBehavior={LoadingBehaviors.ShowWrapper}
      />
    );
  }

  get details() {
    const product = this.product;

    if (this.isGiftCard()) {
      return (
        <GiftCardForm
          product={product}
          addToCart={this.addToCart}
          onSkuChange={this.setCurrentSku}
          selectedSku={this.currentSku}
          attributes={this.state.attributes}
          onAttributeChange={this.setAttributeFromField}
        />
      );
    }

    return (
      <ProductDetails
        product={product}
        quantity={this.state.quantity}
        onQuantityChange={this.changeQuantity}
        addToCart={this.addToCart}
        styleName="details"
      >
        <ProductAttributes
          productDetails={product}
          product={this.props.product}
        />
      </ProductDetails>
    );
  }

  render(): Element<any> {
    const { t, isLoading, notFound, fetchError } = this.props;

    if (isLoading) {
      return <WaitAnimation />;
    }

    if (notFound || this.isArchived) {
      return <p styleName="not-found">{t('Product not found')}</p>;
    }

    if (fetchError) {
      return <ErrorAlerts error={fetchError} />;
    }

    return (
      <div styleName="container">
        <div styleName="gallery">
          {this.renderGallery()}
        </div>
        {this.details}
        <div styleName="related-container">
          {this.relatedProductsList}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(localized(Pdp));
