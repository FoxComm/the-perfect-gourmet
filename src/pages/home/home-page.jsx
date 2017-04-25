/* @flow */

// libs
import React, { Component } from 'react';
import { assetsUrl } from 'lib/env';

// components
import ActionBlock from './action-block';
import ProductsList from '../../components/related-products-list/related-products-list';

// styles
import styles from './home-page.css';

declare var Pixlee: any;

function initPixlee() {
  /* eslint-disable no-undef */
  if (Pixlee) {
    Pixlee.init({
      apiKey: 'ttWLWvqKl2dWPMDKAjgr',
    });
    Pixlee.addSimpleWidget({
      widgetId: 522455,
    });
  }
  /* eslint-enable no-undef */
}

const mainBlocks = [
  {
    imageUrl: '/images/home-page/April15_1.jpg',
    description: 'FOR MEALS AT HOME, AS WELL AS EVERY CELEBRATION THIS SEASON HAS TO OFFER',
    title: 'THE SPRING COLLECTION',
    action: { title: 'Shop Now', link: '/SPRING' },
  },
  {
    imageUrl: '/images/home-page/April15_2.jpg',
    description: 'SO YOU CAN SPEND MORE TIME AT THE TABLE AND LESS TIME IN THE KITCHEN',
    title: 'BRUNCH FAVORITES',
    action: { title: 'Shop Now', link: '/BRUNCH' },
  },
];

const magazineLogos = [
  { name: 'Washington_Post.svg', height: 40 },
  { name: 'Baltimore_Magazine.svg', height: 40 },
  { name: 'WBALTV.svg', height: 60 },
  { name: 'Baltimore_Sun.svg', height: 30 },
];

const magazineBlocks = magazineLogos.map(({ name, height }) => {
  return (
    <img
      src={assetsUrl(`/images/home-page/${name}`)}
      height={height}
      styleName="magazine-logo"
      key={name}
    />
  );
});

const trending = [
  {
    id: 1,
    index: 1,
    productId: 6228,
    slug: 'stan-smith-shoes-5',
    context: 'default',
    title: 'Stan Smith Shoes',
    salePrice: '3000',
    retailPrice: '3000',
    currency: 'USD',
    albums: [{
      name: 'Default',
      images: [
        {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/en_US/dw30317f50/zoom/S75187_01_standard.jpg',
        }, {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/default/dw6ab2d047/zoom/B24101_01_standard.jpg',
        },
      ],
    }],
  }, {
    id: 2,
    index: 2,
    productId: 74301,
    slug: 'nmd_xr1-primeknit-shoes-3',
    context: 'default',
    title: 'NMD_XR1 Primeknit Shoes',
    salePrice: '14000',
    retailPrice: '14000',
    currency: 'USD',
    albums: [{
      name: 'Default',
      images: [
        {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/en_US/dw30ac3559/zoom/BB1967_01_standard.jpg',
        },
      ],
    }],
  }, {
    id: 3,
    index: 3,
    productId: 15329,
    slug: 'd-rose-7-primeknit-shoes',
    context: 'default',
    title: 'D Rose 7 Primeknit Shoes',
    salePrice: '11200',
    retailPrice: '11200',
    currency: 'USD',
    albums: [{
      name: 'Default',
      images: [
        {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/en_US/dw415d68bf/zoom/B72720_01_standard.jpg',
        }, {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/en_US/dw415d68bf/zoom/B72720_01_standard.jpg',
        },
      ],
    }],
  }, {
    id: 4,
    index: 4,
    productId: 105477,
    slug: 'vengeful-shoes-2',
    context: 'default',
    title: 'Vengeful Shoes',
    salePrice: '7700',
    retailPrice: '7700',
    currency: 'USD',
    albums: [{
      name: 'Default',
      images: [
        {
          src: 'http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/Sites-adidas-products/en_US/dwdd8e5444/zoom/BB1638_01_standard.jpg',
        },
      ],
    }],
  },
];

class HomePage extends Component {
  componentDidMount() {
    initPixlee();
  }

  render() {
    const actionBlocks = mainBlocks.map(
      (blockProps, i) => <ActionBlock {...blockProps} key={i} />
    );

    const actionBlocksAndTrendingProducts = [
      actionBlocks.slice(0, 1),
      <ProductsList
        list={trending}
        isLoading={false}
        loadingBehavior={1}
        title="Trending"
        productsOrder={[6228, 74301, 15329, 105477]}
      />,
      actionBlocks.slice(1),
    ];

    return (
      <div>
        {actionBlocksAndTrendingProducts}
        <div styleName="as-seen-in">
          <div styleName="as-seen-in-title">As seen in</div>
          <div styleName="magazine-logos">
            {magazineBlocks}
          </div>
        </div>
        <div styleName="instagram-gallery">
          <div styleName="gallery-wrap">
            <div styleName="feed" id="pixlee_container" />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
