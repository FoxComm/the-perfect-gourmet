/* @flow */

// libs
import React, { Component } from 'react';
import { assetsUrl } from 'lib/env';

// components
import ActionBlock from './action-block';
import ProductsList from '../../components/featured-products-list/featured-products-list';

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
    "taxonomies": {},
    "id": 41,
    "productId": 81,
    "retailPrice": "3600",
    "salePrice": "3600",
    "context": "default",
    "scope": "1",
    "skus": [
      "PG141"
    ],
    "title": "Osso Buco",
    "slug": "osso-buco",
    "tags": [
      "ENTRÉES",
      "VEAL",
      "WINTER",
      "BEEF"
    ],
    "currency": "USD",
    "albums": [
      {
        "name": "Bree Test Album",
        "images": [
          {
            "alt": "2016-11-28-1.jpg",
            "baseurl": null,
            "title": "2016-11-28-1.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/1239/2016-11-28-1.jpg"
          }
        ]
      }
    ],
    "description": "This Milanese specialty features veal shank that's cooked for eighteen hours to tender perfection, then braised in white wine and mirepoix stock, and accompanied by a vegetable medley. Preparation could not be easier; just heat and serve over rice or pasta for a dish that will satisfy the most discerning of palates."
  },
  {
    "taxonomies": {},
    "id": 73,
    "productId": 336,
    "retailPrice": "2700",
    "salePrice": "2700",
    "context": "default",
    "scope": "1",
    "skus": [
      "PG035_t2"
    ],
    "title": "Mushroom Arancini 3",
    "slug": "mushroom-arancini-3-1",
    "tags": [
      "APPETIZERS",
      "MUSHROOM",
      "ITALIAN",
      "PARTY",
      "EASY"
    ],
    "currency": "USD",
    "albums": [
      {
        "name": "Mushroom Arancini",
        "images": [
          {
            "alt": null,
            "baseurl": "Mushroom_Arancini_2x.jpg",
            "title": "Mushroom_Arancini_2x.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/235/Mushroom_Arancini_2x.jpg"
          }
        ]
      }
    ],
    "description": "<p>Arancini means \"little orange\" in Italian, because in Sicily, this treat was traditionally about the size of an orange! Our Mushroom Arancini combines the savory decadence of mushrooms, risotto, mascarpone and cheddar cheeses, elevated by white wine. They're lightly coated with panko crumbs for a delightful, crispy exterior that houses a rich, creamy center.</p>"
  },
  {
    "taxonomies": {},
    "id": 14,
    "productId": 12,
    "retailPrice": "3300",
    "salePrice": "3300",
    "context": "default",
    "scope": "1",
    "skus": [
      "PG010"
    ],
    "title": "Almond Stuffed Dates Wrapped in Bacon",
    "slug": "almond-stuffed-dates-wrapped-in-bacon",
    "tags": [
      "APPETIZERS",
      "BACON",
      "PARTY"
    ],
    "currency": "USD",
    "albums": [
      {
        "name": "Almond Stuffed Dates Wrapped in Bacon",
        "images": [
          {
            "alt": "Almond_Stuffed_Dates_2_2x.jpg",
            "baseurl": null,
            "title": "Almond_Stuffed_Dates_2_2x.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/135/Almond_Stuffed_Dates_2_2x.jpg"
          }
        ]
      }
    ],
    "description": "Elegant enough to serve at a cocktail party, these little appetizers are too tasty not to also keep on hand for yourself. The savory, smoky flavor of bacon is balanced with the sweetness of caramelized dates, creating the perfect combination of flavor and texture in each bite."
  },
  {
    "taxonomies": {},
    "id": 22,
    "productId": 43,
    "retailPrice": "2200",
    "salePrice": "1600",
    "context": "default",
    "scope": "1",
    "skus": [
      "PG107"
    ],
    "title": "Indian Flatbread",
    "slug": "indian-flatbread1",
    "tags": [
      "ENTRÉES",
      "APPETIZERS",
      "VEGETARIAN",
      "PIZZA",
      "FLATBREAD",
      "WEEKNIGHT"
    ],
    "currency": "USD",
    "albums": [
      {
        "name": "Indian Flatbread",
        "images": [
          {
            "alt": "Indian_Flat_Bread_2x.jpg",
            "baseurl": null,
            "title": "Indian_Flat_Bread_2x.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/138/Indian_Flat_Bread_2x.jpg"
          }
        ]
      }
    ],
    "description": "<p>This flavorful flatbread is piled high with six different vegetables, feta cheese, and a rich, Jalfrezi sauce. Perfect as a light, satisfying appetizer or vegetarian entreé, though highly addictive!</p>"
  },
  {
    "taxonomies": {},
    "id": 60,
    "productId": 108,
    "retailPrice": "3400",
    "salePrice": "3400",
    "context": "default",
    "scope": "1",
    "skus": [
      "PG139"
    ],
    "title": "Chicken Roulade Stuffed with Asparagus and Prosciutto",
    "slug": "chicken-roulade-stuffed-with-asparagus-and-prosciutto",
    "tags": [
      "ENTRÉES",
      "ROAST",
      "WINTER",
      "HOLIDAY",
      "FAMILY"
    ],
    "currency": "USD",
    "albums": [
      {
        "name": "Chicken Roulade Stuffed with Asparagus and Prosciutto",
        "images": [
          {
            "alt": null,
            "baseurl": "Chicken_Roulade_asparagus_2x.jpg",
            "title": "Chicken_Roulade_asparagus_2x.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/141/Chicken_Roulade_asparagus_2x.jpg"
          },
          {
            "alt": "trump.jpg",
            "baseurl": null,
            "title": "trump.jpg",
            "src": "https://s3-us-west-1.amazonaws.com/tpg-production-images/albums/1/141/trump.jpg"
          }
        ]
      }
    ],
    "description": "This Chicken Roulade is perfect for an easy, effortless dinner for four in under an hour, and is a wonderful solution for last minute holiday meals. Juicy chicken breast meat surrounds a blend of prosciutto, asparagus, fontina cheese, cream cheese, red and yellow peppers and pine nuts. It's great for gift giving, but don't forget to get an extra one for yourself."
  }
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
        key="featured-product-list"
        list={trending}
        isLoading={false}
        loadingBehavior={1}
        title="This Month’s New & Featured Dishes"
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
