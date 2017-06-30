/* @flow */

// libs
import _ from 'lodash';
import React from 'react';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import { Link } from 'react-router';
import { Icon } from '@foxcomm/storefront-react/tpg';

// styles
import styles from './pdp.css';

type State = {
  currentAdditionalTitle: string,
};

const additionalInfoAttributesMap = [
  {
    title: 'Details',
    attributes: ['description', 'Amount of Servings', 'Serving Size'],
  },
  {
    title: 'Prep',
    attributes: ['Conventional Oven', 'Microwave', 'Pan Fry', 'Steam', 'Grill', 'Defrost'],
  },
  {
    title: 'Ingredients',
    attributes: ['Ingredients', 'Allergy Alerts', 'Allergies'],
  },
  {
    title: 'Nutrition',
    attributes: ['Nutritional Information', 'Nutrition'],
  },
];

export default class ProductAttributes extends React.Component {
  props: {
    product: any,
    productDetails: any,
  };

  state: State = {
    currentAdditionalTitle: 'Details',
  };

  shareLinks (isDetails: boolean,
    ProductURL: string,
    ProductShareTitle: string,
    TwitterHandle: string,
    ProductDescription: string,
    ProductImage: string) {
    if (!isDetails) return null;
    return (
      <div styleName="social-sharing">
        <Link to={`https://www.facebook.com/sharer/sharer.php?u=${ProductURL}&title=${ProductShareTitle}&description=${ProductDescription}&picture=${ProductImage}`} target="_blank" styleName="social-icon">
          <Icon name="facebook" styleName="social-icon" />
        </Link>

        <Link to={`https://twitter.com/intent/tweet?text=${ProductShareTitle}&url=${ProductURL}&via=${TwitterHandle}`} target="_blank" styleName="social-icon">
          <Icon name="twitter" styleName="social-icon" />
        </Link>

        <Link to={`https://pinterest.com/pin/create/button/?url=${ProductURL}&media=${ProductImage}&description=${ProductDescription}`} target="_blank" styleName="social-icon">
          <Icon name="pinterest" styleName="social-icon" />
        </Link>
      </div>
    );
  }

  attributeDescription (attributeName: string, attributeValue: string) {
    if (attributeName == 'Amount of Servings' || attributeName == 'Serving Size') {
      return (
        <div styleName="attribute-description">
          <div styleName="servings">{attributeValue}</div>
        </div>
      );
    }
    return (
      <div
        styleName="attribute-description"
        dangerouslySetInnerHTML={{__html: attributeValue}}
      />
    );
  }

  displayAttribute (product: Object, attributeName: string, isDetails: boolean) {
    const attributeValue = _.get(product, `attributes.${attributeName}.v`);
    if (attributeValue === undefined || _.isEmpty(attributeValue)) return null;
    const title = !isDetails ? <div styleName="attribute-title">{attributeName}</div> : null;
    return (
      <div className="attribute-line" key={attributeName}>
        {title}
        {this.attributeDescription(attributeName, attributeValue)}
      </div>
    );
  }

  generateAttributesBodys (product: Object, productDetails: Object, attributeNames: Array<string> = []) {
    const ProductURL = `http://theperfectgourmet.com${productDetails.pathName}`;
    const ProductDescription = _.get(productDetails, 'description');
    const ProductImage = _.get(productDetails, 'images.0');
    const ProductShareTitle = _.get(productDetails, 'title');
    const TwitterHandle = 'perfectgourmet1';
    const isDetails = _.isEqual(attributeNames, ['description', 'Amount of Servings', 'Serving Size']);
    return (
      <div styleName={isDetails ? 'description' : ''}>
        {_.map(attributeNames, attributeName => this.displayAttribute(product, attributeName, isDetails))}
        {this.shareLinks(isDetails, ProductURL, ProductShareTitle, TwitterHandle, ProductDescription, ProductImage)}
      </div>
    );
  }

  @autobind
  renderAttributes() {
    const { attributes } =
      _.find(additionalInfoAttributesMap,
        attr => attr.title == this.state.currentAdditionalTitle) || {};

    return this.generateAttributesBodys(this.props.product, this.props.productDetails, attributes);
  }

  @autobind
  setCurrentAdditionalAttr(currentAdditionalTitle: string) {
    this.setState({ currentAdditionalTitle });
  }

  @autobind
  renderAttributesTitles() {
    return additionalInfoAttributesMap.map(({ title }) => {
      const cls = cx(styles['item-title'], {
        [styles.active]: title === this.state.currentAdditionalTitle,
      });
      const onClick = this.setCurrentAdditionalAttr.bind(this, title);

      return (
        <div className={cls} onClick={onClick} key={title}>
          {title}
        </div>
      );
    });
  }

  render() {
    return (
      <div styleName="additional-info">
        <div>
          <div styleName="items-title-wrap">
            {this.renderAttributesTitles()}
          </div>

          <div styleName="info-block">
            {this.renderAttributes()}
          </div>
        </div>
      </div>
    );
  }
}
