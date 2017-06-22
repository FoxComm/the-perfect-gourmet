
import { createReducer } from 'redux-act';
import { createAsyncActions } from '@foxcomm/wings';
import {
  addPriceFilter,
  addTaxonomyFilter,
  addTaxonomiesAggregation,
  addMatchQuery,
  addMustNotFilter, defaultSearch, termFilter, addCategoryFilter, addTermFilter,
} from 'lib/elastic';
import _ from 'lodash';
import { api } from 'lib/api';

import type { Facet } from 'types/facets';

export type Product = {
  id: number;
  context: string,
  title: string;
  description: string,
  images: ?Array<string>,
  currency: string,
  productId: number,
  salePrice: string,
  scope: string,
  skus: Array<string>,
  tags: Array<string>,
  albums: ?Array<Object> | Object,
}

type QueryOpts = {
  sorting?: { direction: number|string, field: string },
  toLoad: number|string,
  from: number|string,
  ignoreGiftCards?: boolean,
}

export const MAX_RESULTS = 1000;
export const PAGE_SIZE = 1000;
const context = process.env.FIREBIRD_CONTEXT || 'default';
const GIFT_CARD_TAG = 'GIFT-CARD';


function apiCall(categoryNames: ?Array<string>,
                 selectedFacets: Object,
                 searchTerm: ?string,
                 {
                   sorting,
                   toLoad = PAGE_SIZE,
                   from = 0,
                   ignoreGiftCards = true,
                 }:QueryOpts): Promise<any> {
  let payload = defaultSearch(context);

  _.forEach(_.compact(categoryNames), (cat) => {
    if (cat !== 'ALL' && cat !== GIFT_CARD_TAG) {
      payload = addCategoryFilter(payload, cat.toUpperCase());
    } else if (cat === GIFT_CARD_TAG) {
      const tagTerm = termFilter('tags', cat.toUpperCase());
      payload = addTermFilter(payload, tagTerm);
    }
  });
  if (searchTerm) {
    payload = addMatchQuery(payload, searchTerm);
  }

  if (ignoreGiftCards) {
    const giftCardTerm = termFilter('tags', GIFT_CARD_TAG);
    payload = addMustNotFilter(payload, giftCardTerm);
  }

  if (sorting) {
    const order = sorting.direction === -1 ? 'desc' : 'asc';
    payload.sort = [{ [sorting.field]: { order } }];
  }

  payload = addTaxonomiesAggregation(payload);

  _.forEach(selectedFacets, (values: Array<string>, facet: string) => {
    if (!_.isEmpty(values)) {
      payload = facet == 'PRICE'
        ? addPriceFilter(payload, values)
        : addTaxonomyFilter(payload, facet, values);
    }
  });

  const url = `/search/public/products_catalog_view/_search?size=${toLoad}&from=${from}`;
  return this.api.post(url, payload);
}

function searchGiftCards() {
  const [sorting, selectedFacets, toLoad] = [null, {}, MAX_RESULTS];
  return apiCall.call(
    { api },
    [GIFT_CARD_TAG],
    sorting,
    selectedFacets,
    toLoad,
    0,
    { ignoreGiftCards: false }
  );
}

const {fetch, ...actions} = createAsyncActions('products', apiCall);

const initialState = {
  list: [],
  facets: [],
};


function determineFacetKind(f: string): string {
  if (f.includes('COLOR')) return 'color';
  else if (f.includes('SIZE')) return 'circle';
  return 'checkbox';
}

function titleCase(t) {
  return _.startCase(_.toLower(t));
}

function mapAggregationsToFacets(aggregations): Array<Facet> {
  return _.map(aggregations, (a) => {
    const kind = determineFacetKind(a.key);
    const buckets = _.get(a, 'taxon.buckets', []);
    const values = _.uniqBy(_.map(buckets, (t) => {
      return {
        label: titleCase(t.key),
        value: t.key,
        count: t.doc_count,
      };
    }), (v) => {
      return kind == 'color' ? v.value.color : v.label;
    });

    return {
      key: a.key,
      name: titleCase(a.key),
      kind,
      values,
    };
  });
}

function priceLabel(from: ?number, to: ?number): string {
  if (from && to) {
    return `$${from / 100} - $${to / 100}`;
  } else if (from) {
    return `$${from / 100}+`;
  } else if (to) {
    return `$0 - $${to / 100}`;
  }

  return '';
}

function mapPriceAggregationsToFacets(response = []): Array<Facet> {
  const aggregations = _.get(response, 'aggregations.priceRanges.buckets', []);

  const prices = aggregations.reduce((acc, priceAgg) => {
    const { key, from, to } = priceAgg;

    if (priceAgg.doc_count < 1) {
      return acc;
    }

    return [...acc, {
      count: priceAgg.doc_count,
      label: priceLabel(from, to),
      value: key,
      selected: false,
    }];
  }, []);

  if (prices.length == 0) {
    return [];
  }

  return [{
    key: 'PRICE',
    name: 'Price',
    kind: 'price',
    values: prices,
  }];
}

const reducer = createReducer({
  [actions.succeeded]: (state, response) => {
    const payloadResult = response.result;
    const aggregations = _.isNil(response.aggregations)
      ? []
      : _.get(response, 'aggregations.taxonomies.taxonomy.buckets', []);
    const list = _.isEmpty(payloadResult) ? [] : payloadResult;

    const facetsFromAggregations = mapAggregationsToFacets(aggregations);
    const priceFacet = mapPriceAggregationsToFacets(response);

    return {
      ...state,
      list,
      facets: [...facetsFromAggregations, ...priceFacet],
    };
  },
}, initialState);

export {
  reducer as default,
  fetch,
  searchGiftCards,
};
