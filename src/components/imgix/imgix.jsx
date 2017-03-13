/* eslint-disable max-len */

import React from 'react';
import Imgix from 'react-imgix';

export default class ImgixResponsiveWrapper extends React.Component {
  render() {
    const allProps = {
      auto: ['compress', 'format'],
      fit: 'clip',
      faces: false,
      ...this.props,
    };

    return (
      <Imgix
        src={this.props.src}
        width="defaultWidth"
        height="defaultHeight"
        type="picture"
        {...allProps}
      >
        {/* See css/media-queries.css */}
        {/* Ordering media queries from highest to lowest is matter here */}
        <Imgix width="defaultWidth" height={800} {...allProps} type="source" imgProps={{media: '(min-width: 90.063em)'}}/>
        <Imgix width="defaultWidth" height={600} {...allProps} type="source" imgProps={{media: '(min-width: 64em)'}}/>
        <Imgix width="defaultWidth" height={500} {...allProps} type="source" imgProps={{media: '(min-width: 48em)'}}/>
        <Imgix width="defaultWidth" height={300} {...allProps} type="source" imgProps={{media: '(max-width: 47.9375em)'}}/>
      </Imgix>
    );
  }
}
