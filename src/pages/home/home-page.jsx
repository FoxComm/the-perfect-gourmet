/* @flow */

// libs
import React, { Component } from 'react';
import { assetsUrl } from 'lib/env';

// components
import ActionBlock from './action-block';
import ProductsList from '../../components/products-list/products-list';

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
    imageUrl: '/images/home-page/Home_Hero_Summer.jpg',
    description: 'Bring everyone together this summer with crowd-pleasing starters and entrées',
    title: 'Entertaining Made Easy',
    action: { title: 'Shop Now', link: '/SUMMER' },
  },
  {
    imageUrl: '/images/home-page/Best_Sellers_June_Home_Hero_2.jpg',
    description: 'Shop our most popular dishes and discover your new favorite',
    title: 'Best-Sellers',
    action: { title: 'Shop Now', link: '/BEST-SELLERS' },
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

const featured = [
  {
    amountOfServings: '80 Count',
    taxonomies: {},
    id: 41,
    productId: 81,
    retailPrice: '6000',
    salePrice: '6000',
    context: 'default',
    scope: '1',
    skus: [
      'PG141',
    ],
    title: 'Kung Pao Potstickers',
    slug: 'kung-pao-chicken-potstickers',
    tags: [
      'ENTRÉES',
      'VEAL',
      'WINTER',
      'BEEF',
    ],
    currency: 'USD',
    albums: [
      {
        name: 'Kung Pao Potstickers',
        images: [
          {
            alt: 'Kung Pao Potstickers',
            baseurl: null,
            title: 'Kung Pao Potstickers',
            src: 'https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/436/potsticker%202.jpg',
          },
        ],
      },
    ],
    description: `We took one of America's favorite Chinese dishes and made it
      into a potsticker. A chicken, cabbage, and water chestnut filling is nestled
      inside delicate wonton wrappers for a savory potsticker with a kick of heat.`,
  },
  {
    amountOfServings: '4 Count',
    taxonomies: {},
    id: 73,
    productId: 336,
    retailPrice: '2700',
    salePrice: '2700',
    context: 'default',
    scope: '1',
    skus: [
      'PG035_t2',
    ],
    title: 'Chicken & Cranberry Vegetable Stuffing',
    slug: 'cranberry-vegetable-chicken',
    tags: [
      'APPETIZERS',
      'MUSHROOM',
      'ITALIAN',
      'PARTY',
      'EASY',
    ],
    currency: 'USD',
    albums: [
      {
        name: 'Chicken & Cranberry Vegetable Stuffing',
        images: [
          {
            alt: 'Chicken & Cranberry Vegetable Stuffing',
            baseurl: null,
            title: 'Chicken & Cranberry Vegetable Stuffing',
            src: 'https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/426/Cranberry%20Stuffed%20Chicken.jpg',
          },
        ],
      },
    ],
    description: `Enjoy all the flavors of Thanksgiving dinner any time of the year
      with our Chicken with Cranberry Vegetable Stuffing. These chicken breasts are
      trimmed then filled with a signature stuffing made from cranberries, sweet
      potato, onions, celery, carrots, corn, garlic, 14 herbs and spices, toasted
      croutons, and an all-natural chicken stock. `,
  },
  {
    amountOfServings: '4 Count',
    taxonomies: {},
    id: 14,
    productId: 12,
    retailPrice: '2500',
    salePrice: '2500',
    context: 'default',
    scope: '1',
    skus: [
      'PG010',
    ],
    title: 'Chicken Parmesan Supreme',
    slug: 'chicken-parmesan-supreme',
    tags: [
      'APPETIZERS',
      'BACON',
      'PARTY',
    ],
    currency: 'USD',
    albums: [
      {
        name: 'Chicken Parmesan Supreme',
        images: [
          {
            alt: 'Chicken Parmesan Supreme',
            baseurl: null,
            title: 'Chicken Parmesan Supreme',
            src: 'https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/434/chicken%20parm%20supreme.jpg',
          },
        ],
      },
    ],
    description: `We took two Italian-American favorites: Chicken Parmesan and pepperoni,
      and combined them to create our Chicken Parmesan Supreme. This dish has everything
      you already know and love, plus a delicious pepperoni topping, for a classic dinner
      favorite taken to the next level.`,
  },
  {
    amountOfServings: '1 Flatbread',
    taxonomies: {},
    id: 22,
    productId: 43,
    retailPrice: '1900',
    salePrice: '1900',
    context: 'default',
    scope: '1',
    skus: [
      'PG107',
    ],
    title: 'Shrimp and Scallop Flatbread',
    slug: 'shrimp-scallop-flatbread',
    tags: [
      'ENTRÉES',
      'APPETIZERS',
      'VEGETARIAN',
      'PIZZA',
      'FLATBREAD',
      'WEEKNIGHT',
    ],
    currency: 'USD',
    albums: [
      {
        name: 'Shrimp and Scallop Flatbread',
        images: [
          {
            alt: 'Shrimp and Scallop Flatbread',
            baseurl: null,
            title: 'Shrimp and Scallop Flatbread',
            src: 'https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/447/shrimp%20scallop%20flatbread.jpg',
          },
        ],
      },
    ],
    description: `Our newest flatbread is comprised of a thin crust loaded with shrimp,
      scallops, and spinach, then topped with Parmesan cheese and scallions.  Light,
      but still super satisfying, it's ready in 15 minutes, and makes a great light
      lunch or dinner accompaniment.`,
  },
  {
    amountOfServings: '4 Count',
    taxonomies: {},
    id: 60,
    productId: 108,
    retailPrice: '3500',
    salePrice: '3500',
    context: 'default',
    scope: '1',
    skus: [
      'PG139',
    ],
    title: 'Salmon Tart',
    slug: 'salmon-tart-2',
    tags: [
      'ENTRÉES',
      'ROAST',
      'WINTER',
      'HOLIDAY',
      'FAMILY',
    ],
    currency: 'USD',
    albums: [
      {
        name: 'Salmon Tart',
        images: [
          {
            alt: 'Salmon Tart',
            baseurl: null,
            title: 'Salmon Tart',
            src: 'https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/464/salmon%20tart%20sale.jpg',
          },
        ],
      },
    ],
    description: `Each invidivual pastry shell is encrusted in Parmesan, and brimming
      with a savory combination of smoked salmon, cream cheese, Gouda, asparagus
      and onion. Each bite of crispy pastry and silky, cheesey filling make for the
      perfect balance of flavor and texture.`,
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

    const actionAndFeaturedBlocks = [
      actionBlocks.slice(0, 1),
      <ProductsList
        key="featured-product-list"
        list={featured}
        isLoading={false}
        loadingBehavior={1}
        title="This Month’s New & Featured Dishes"
        size="small"
        showAddToCartButton={false}
        showServings
        showDescriptionOnHover={false}
      />,
      actionBlocks.slice(1),
    ];

    return (
      <div>
        {actionAndFeaturedBlocks}
        <div styleName="as-seen-in">
          <div styleName="as-seen-in-title">As seen in</div>
          <div styleName="magazine-logos">
            {magazineBlocks}
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
