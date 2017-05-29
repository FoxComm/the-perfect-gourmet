/* @flow */

// libs
import _ from 'lodash';
import React from 'react';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import { Link } from 'react-router';
import Icon from 'ui/icon';

// styles
import styles from './pdp.css';

type State = {
  currentAdditionalTitle: string,
  detailsHeight: number,
};

const displayAttribute = (product, attributeName, isDetails) => {
  const attributeValue = _.get(product, `attributes.${attributeName}.v`);

  if (attributeValue === undefined || _.isEmpty(attributeValue)) {
    return null;
  }
  const title = !isDetails ? <div styleName="attribute-title">{attributeName}</div> : null;

  return (
    <div className="attribute-line" key={attributeName}>
      {title}
      <div styleName="attribute-description">
        {
          (attributeName == 'Amount of Servings' ||
          attributeName == 'Serving Size') ? <div styleName="servings">{attributeValue}</div> :
          attributeValue
        }
      </div>
    </div>
  );
};

const renderAttributes = (product, productDetails, attributeNames = []) => {
  const ProductURL = `http://theperfectgourmet.com${productDetails.pathName}`;
  const ProductDescription = _.get(productDetails, 'description');
  const ProductImage = _.get(productDetails, 'images.0');
  const ProductShareTitle = _.get(productDetails, 'title');
  const TwitterHandle = 'perfectgourmet1';
  const isDetails = _.isEqual(attributeNames, ['description', 'Amount of Servings', 'Serving Size']);
  return (
    <div styleName={isDetails ? 'description' : ''}>
      {attributeNames.map((attributeName) => displayAttribute(product, attributeName, isDetails))}
      {isDetails ? <div styleName="social-sharing">
        <Link to={`https://www.facebook.com/sharer/sharer.php?u=${ProductURL}&title=${ProductShareTitle}&description=${ProductDescription}&picture=${ProductImage}`} target="_blank" styleName="social-icon">
          <Icon name="fc-facebook" styleName="social-icon"/>
        </Link>

        <Link to={`https://twitter.com/intent/tweet?text=${ProductShareTitle}&url=${ProductURL}&via=${TwitterHandle}`} target="_blank" styleName="social-icon">
          <Icon name="fc-twitter" styleName="social-icon" />
        </Link>

        <Link to={`https://pinterest.com/pin/create/button/?url=${ProductURL}&media=${ProductImage}&description=${ProductDescription}`} target="_blank" styleName="social-icon">
          <Icon name="fc-pinterest" styleName="social-icon"/>
        </Link>
      </div> : null}
    </div>
  );
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
    detailsWidth: any,
  };

  state: State = {
    currentAdditionalTitle: 'Details',
    detailsHeight: 0,
  };

  @autobind
  renderAttributes() {
    const { attributes } =
      _.find(additionalInfoAttributesMap,
        attr => attr.title == this.state.currentAdditionalTitle) || {};

    return renderAttributes(this.props.product, this.props.productDetails, attributes);
  }

  @autobind
  setCurrentAdditionalAttr(currentAdditionalTitle: string) {
    this.setState({ currentAdditionalTitle });
  }

  @autobind
  calcHeight() {
    return this.props.detailsWidth / 1.035483871 - this.state.detailsHeight - 96;
  }

  @autobind
  setInfoBlockSize() {
    this.setState({
      detailsHeight: document.getElementById('pdp').offsetHeight,
    });
  }

  componentDidMount() {
    this.setInfoBlockSize();
    window.addEventListener('resize', this.setInfoBlockSize);
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
    const height = this.calcHeight();
    return (
      <div styleName="additional-info">
        <div>
          <div styleName="items-title-wrap">
            {this.renderAttributesTitles()}
          </div>

          <div style={{height}} id="pdp-info-block" styleName="info-block">
            {this.renderAttributes()}
          </div>
        </div>
      </div>
    );
  }
}
