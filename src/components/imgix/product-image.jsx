import React from 'react';
import Imgix from './imgix';
import { env } from 'lib/env';

const {
  IMGIX_PRODUCTS_SOURCE,
  S3_BUCKET_NAME,
  S3_BUCKET_PREFIX,
} = env;

const s3PrefixRegExp = new RegExp(`https:\/\/.*\/${S3_BUCKET_NAME}\/${S3_BUCKET_PREFIX}\/(.*)`);

export default class ProductImage extends React.Component {
  render() {
    if (!IMGIX_PRODUCTS_SOURCE) {
      return <img {...this.props} />;
    }

    const [, s3RelativeUrl] = this.props.src.match(s3PrefixRegExp);
    const imgixUrl = `${IMGIX_PRODUCTS_SOURCE}/${s3RelativeUrl}`;

    return <Imgix {...this.props} src={imgixUrl} />;
  }
}
