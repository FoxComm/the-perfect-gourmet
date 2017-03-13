/* @flow */

// libs
import React, { Component } from 'react';
import { assetsUrl } from 'lib/env';

// components
import ActionBlock from './action-block';

// styles
import styles from './home-page.css';

function initPixlee() {
  if (Pixlee) {
    Pixlee.init({
      apiKey: "ttWLWvqKl2dWPMDKAjgr",
    });
    Pixlee.addSimpleWidget({
      widgetId: 511610,
    });
  }
}

const mainBlocks = [
  {
    imageUrl: '/images/home-page/Home_Section_3_1_03.jpg',
    description: 'No planning, shopping, prepping, or cleaning required',
    title: 'DINNER IS SERVED',
    action: { title: 'Shop Now', link: '/ENTRÉES' },
  },
  {
    imageUrl: '/images/home-page/Home_Section_2_1_03.jpg',
    description: '',
    title: 'SIMPLE STARTERS',
    action: { title: 'Shop Now', link: '/APPETIZERS' },
  },
  {
    imageUrl: '/images/home-page/About_Us_Hero_1_03.jpg',
    description: '',
    title: 'WHAT MAKES US DIFFERENT?',
    action: { title: 'Learn more', link: '/about' },
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

class HomePage extends Component {
  componentDidMount() {
    initPixlee()
  }

  render() {
    const actionBlocks = mainBlocks.map(
      (blockProps, i) => <ActionBlock {...blockProps} key={i} />
    );

    return (
      <div>
        {actionBlocks}
        <div styleName="as-seen-in">
          <div styleName="as-seen-in-title">As seen in</div>
          <div styleName="magazine-logos">
            {magazineBlocks}
          </div>
        </div>
        <div styleName="instagram-gallery">
          <div styleName="gallery-wrap">
            <div styleName="instagram-info">
              <h1 styleName="instagram-title">BAKE. SNAP. WIN!</h1>
              <div styleName="hashtag-image" />
              <div styleName="instagram-description">
                Love The Perfect Gourmet? Let us know!
                Share the love using #mygourmet for a chance to be featured here!
              </div>
            </div>
            <div styleName="feed" id="pixlee_container" />
          </div>
        </div>
      </div>
    );
  };
}

export default HomePage;
