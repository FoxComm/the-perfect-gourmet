/* @flow */

import React, { Component } from 'react';
import type { HTMLElement } from 'types';

import Banner from '../banner/banner';
import styles from './main.css';


class Main extends Component {

  get topBanner(): HTMLElement {
    return (
      <div styleName="top-banner">
        <div styleName="wrap">
          <Banner
            header="Summer 2016"
            description="New collection is here"
            links={[
              {to: '/all?shop=men', text: 'Shop Men'},
              {to: '/all?shop=women', text: 'Shop Women'},
            ]}
          />
        </div>
      </div>
    );
  }

  get categories(): HTMLElement {
    return (
      <div styleName="categories">
        <div styleName="wrap">
          <article styleName="categories__link">
            <h2 styleName="categories__name">
              EYEGLASSES
            </h2>
            <div styleName="categories__image">
              <img src="images/banners/eyeglasses.jpg" />
            </div>
          </article>
          <article styleName="categories__link">
            <h2 styleName="categories__name">
              SUNGLASSES
            </h2>
            <div styleName="categories__image">
              <img src="images/banners/sunglasses.jpg" />
            </div>
          </article>
        </div>
      </div>
    );
  }

  get tryAtHomeBanner(): HTMLElement {
    return (
      <div styleName="try-at-home-banner">
        <div styleName="wrap">
          <Banner
            header="Try @ home"
            description="5 pairs. 5 days. Free"
            links={[
              {to: '/try-at-home', text: 'Learn More'},
            ]}
          />
        </div>
      </div>
    );
  }

  get visitAStoreBanner(): HTMLElement {
    return (
      <div styleName="visit-a-store-banner">
        <div styleName="wrap">
          <Banner
            header="Visit a store"
            description="Try them on in person!"
            links={[
              {to: 'locations', text: 'Locations'},
            ]}
          />
          <div styleName="visit-a-store-banner__image"></div>
        </div>
      </div>
    );
  }

  render(): HTMLElement {
    return (
      <div>
        {this.topBanner}
        {this.categories}
        {this.tryAtHomeBanner}
        {this.visitAStoreBanner}
      </div>
    );
  }
}

export default Main;
