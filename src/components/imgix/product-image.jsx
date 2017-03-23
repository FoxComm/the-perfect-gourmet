import { env } from 'lib/env';
import createProductImage from '@foxcomm/wings/lib/ui/imgix/create-product-image';

const {
  IMGIX_PRODUCTS_SOURCE,
  S3_BUCKET_NAME,
  S3_BUCKET_PREFIX,
} = env;

const ProductImage = createProductImage(
  IMGIX_PRODUCTS_SOURCE,
  S3_BUCKET_NAME,
  S3_BUCKET_PREFIX
);

export default ProductImage;
