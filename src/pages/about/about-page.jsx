/* @flow */

// libs
import React from 'react';
import { Link } from 'react-router';
import scrollTo from 'lib/scroll-to';
import { autobind } from 'core-decorators';
import { assetsUrl } from 'lib/env';

// styles
import styles from './about-page.css';

// components
import IntroSLider from './intro-slider';
import MentionBlock from './mention-block';
import CookingBlock from './cooking-block';

import mentions from './mentions';

const headerOffset = 86;

const mentionBlocks = mentions.map((mention, i) =>
  (<div styleName="mention-wrap" key={i}>
    <MentionBlock
      urlPrefix={assetsUrl('/images/about-page')}
      mention={mention}
    />
  </div>)
);

export default class AboutPage extends React.Component {

  @autobind
  scrollToIntroBlock() {
    scrollTo(this.refs.introBlock, 1000, headerOffset);
  }

  render() {
    return (
      <div>
        <div styleName="top-header-wrap">
          <div styleName="logo-white" />
          <div styleName="text-wrap">
            <h1 styleName="title">CHEF CRAFTED MEALS DELIVERED TO YOUR DOOR</h1>
          </div>
          <div styleName="scroll-arrow" onClick={this.scrollToIntroBlock} />
        </div>

        <div styleName="intro-block" ref="introBlock">
          <div styleName="content-wrapper">
            <div styleName="intro-title">THE PERFECT GOURMET IS PERFECT FOR</div>
            <IntroSLider />
            <div styleName="intro-text">

              <p><b>What Makes Us Different?</b></p>

              <p>Dinner should be an enjoyable end to your busy day, not another reason
                to stress. While meal kit delivery services sound fun and appealing, they
                don’t save you much time or money.</p>

              <p>What if you could enjoy delicious, gourmet dinners without having to prep,
                cook, or clean up--and for less than you pay to do all that work yourself?</p>

              <p>The Perfect Gourmet does all the work for you. Whether it’s our Osso Buco,
                Thai Chicken, Indian Flatbread, (the list goes on and on), every single dish
                begins with a great recipe and high-quality ingredients. We then flash freeze
                and deliver the food right to your door, so that it’s ready to cook from frozen
                whenever you want it.</p>

              <p>We know what you’re thinking. “Hmm...<i>Frozen</i> food?”</p>

              <p>Don’t let other frozen foods give you any misconceptions about ours. Unlike
                other brands, we use high-quality ingredients at the peak of freshness, then
                use this process to preserve all of their flavors and nutrients. This makes your
                food taste as if you just spent hours in the kitchen, and allows you to enjoy
                meals and ingredients that aren’t in season any time you want.</p>

              <p>Most of our food can be kept in the freezer for up to a year, and is specifically
                designed to cook from frozen--no thawing required. Cook what you want, when you want
               it. Waste will be a thing of the past.</p>

              <p>Since 2006, we have been crafting and delivering these delicious meals to over 200,000
                happy households a year. Discover how stress-free your dinners can be, and let us show
                you why <b>frozen</b> is the new fresh.</p>
            </div>

            <Link to="/best-sellers" styleName="action-link">
              Shop Best Sellers
            </Link>
          </div>
        </div>

        <CookingBlock />

        <div styleName="fresh-header-wrap">
          <div styleName="content-wrapper">
            <div styleName="text-wrap">
              <div styleName="fresh-description">QUALITY IS OUR TOP PRIORITY</div>
              <h1 styleName="title">LET US SHOW YOU WHY FROZEN IS THE NEW FRESH</h1>
            </div>
          </div>
        </div>

        <div styleName="mentions">
          <div styleName="mentions-header-wrap">
            <div styleName="mentions-text-wrap">
              <div styleName="mentions-description">OUR CUSTOMERS ARE SHARING THE LOVE</div>
              <h1 styleName="mentions-title">WHAT PEOPLE ARE SAYING</h1>
            </div>
          </div>
          <div styleName="mention-blocks">
            {mentionBlocks}
          </div>
        </div>

        <div styleName="gifts-block">
          <div styleName="gifts-header-wrap">
            <div styleName="gifts-wrap">
              <div styleName="gifts-description">THE PERFECT GOURMET</div>
              <h1 styleName="gifts-title">MAKES THE PERFECT GIFT</h1>
              <div styleName="gifts-text">
                Give the gift of delicious food for any occasion
                with The Perfect Gourmet digital gift cards.
              </div>
              <Link to="/gift-cards" styleName="shop-gift-cards-link">
                Shop gift cards
              </Link>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
