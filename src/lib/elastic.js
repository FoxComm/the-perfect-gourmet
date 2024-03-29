/* @flow */
import { assoc } from 'sprout-data';
import _ from 'lodash';


export type TermFilter = {
  term: {
    [key:string]: any,
  },
};

export type TermsFilter = {
  terms: {
    [key:string]: any,
  },
};

export type MatchFilter = {
  match: {
    _all: {
      query: string,
      type: string,
      max_expansions: number,
    },
  },
};

type SortOrder = {
  order: 'desc' | 'asc',
}

type SortValue = {
  [key: string]: SortOrder,
}

export type BoolQuery = {
  query: {
    bool: {
      // filter clauses are like must clauses except that they do not contribute to the score
      filter: Array<TermFilter | TermsFilter>,
      must?: Array<MatchFilter | TermFilter>,
      must_not?: Array<MatchFilter | TermFilter>,
    },
  },
  sort?: Array<SortValue>,
};

export type QueryStringFilter = {
  query_string: Object,
};

export function termFilter(term: string, value: any): TermFilter {
  return {
    term: {
      [term]: value,
    },
  };
}

export function termsFilter(term: string, values: Array<any>): TermsFilter {
  return {
    terms: {
      [term]: values,
    },
  };
}

export function defaultSearch(context: string): BoolQuery {
  return {
    query: {
      bool: {
        filter: [termFilter('context', context)],
      },
    },
  };
}

export function addTermFilter(initialQuery: BoolQuery, term: TermFilter): BoolQuery {
  return assoc(initialQuery,
    ['query', 'bool', 'filter'], [...initialQuery.query.bool.filter, term]
  );
}

export function addTermsFilter(initialQuery: BoolQuery, terms: TermsFilter): BoolQuery {
  return assoc(initialQuery,
    ['query', 'bool', 'filter'], [...initialQuery.query.bool.filter, terms]
  );
}

export function addMustFilter(
  initialQuery: BoolQuery, filter: MatchFilter | TermFilter | QueryStringFilter): BoolQuery {
  return assoc(initialQuery,
    ['query', 'bool', 'must'], [...initialQuery.query.bool.must || [], filter]
  );
}

export function addMustNotFilter(
  initialQuery: BoolQuery, filter: MatchFilter | TermFilter | QueryStringFilter): BoolQuery {
  return assoc(initialQuery,
    ['query', 'bool', 'must_not'], [...initialQuery.query.bool.must_not || [], filter]
  );
}

export function addQueryString(query: BoolQuery, searchString: string): BoolQuery {
  const matchFilter = {
    query_string: {
      fields: ['title', 'tags', 'description'],
      query: searchString,
      default_operator: 'AND',
    },
  };

  return addMustFilter(query, matchFilter);
}


export function addTaxonomyFilter(initialQuery: BoolQuery,
  taxonomy: string, taxons: Array<string>): BoolQuery {
  const taxonTerms = _.map(taxons, (t) => {
    return { term: { 'taxonomies.taxons': t } };
  });

  const filter = {
    nested: {
      path: 'taxonomies',
      query: {
        bool: {
          must: [
            { term: {'taxonomies.taxonomy': taxonomy} },
            { query: { bool: { should: taxonTerms } } },
          ],
        },
      },
    },
  };
  return assoc(initialQuery,
      ['query', 'bool', 'must'], [...initialQuery.query.bool.must || [], filter]
  );
}

export function addPriceFilter(initialQuery: BoolQuery, values: Array<any>): BoolQuery {
  const ranges = values.map((v) => {
    const tuple = v.split('-');
    const range = {
      gte: parseInt(tuple[0], 10),
      lte: (tuple[1] != '*') ? parseInt(tuple[1], 10) : undefined,
    };

    return {
      range: {
        salePrice: range,
      },
    };
  });

  const shouldFilter = {
    bool: {
      should: ranges,
    },
  };

  return assoc(
    initialQuery,
    ['query', 'bool', 'filter'],
    [...initialQuery.query.bool.filter || [], shouldFilter]);
}


function defaultAggregation() {
  return {
    aggs: {
      taxonomies: {
        nested: {
          path: 'taxonomies',
        },
        aggs: {
          taxonomy: {
            terms: {
              field: 'taxonomies.taxonomy',
            },
            aggs: {
              taxon: {
                terms: {
                  field: 'taxonomies.taxons',
                },
              },
            },
          },
        },
      },
    },
  };
}

/* UNCOMMENT THIS IF PRICE AGGREGATIONS NEEDED
function priceAggregation() {
  const priceBands = [
    { to: 10000 },
    { from: 10000, to: 20000 },
    { from: 20000, to: 35000 },
    { from: 35000, to: 50000 },
    { from: 50000, to: 65000 },
    { from: 65000, to: 80000 },
    { from: 80000, to: 100000 },
    { from: 100000 },
  ];

  return {
    aggs: {
      priceRanges: {
        range: {
          field: 'salePrice',
          ranges: priceBands,
        },
      },
    },
  };
}
*/
export function addTaxonomiesAggregation(initialQuery: BoolQuery): BoolQuery {
  return assoc(
    initialQuery,
    ['aggs'],
    { ...defaultAggregation().aggs });
    /* PRICE AGREGATION IF WE'LL NEED THIS IN FUTURE{ ...defaultAggregation().aggs, ...priceAggregation().aggs }*/
}

export function addMatchQuery(query: BoolQuery, searchString: string): BoolQuery {
  const matchFilter = {
    match: {
      _all: {
        query: searchString,
        type: 'phrase_prefix',
        max_expansions: 3,
      },
    },
  };

  return addMustFilter(query, matchFilter);
}

export function addCategoryFilter(query: BoolQuery, term: TermFilter): BoolQuery {
  const taxonTerms = { term: { 'taxonomies.taxons': term } };

  const filter = {
    nested: {
      path: 'taxonomies',
      query: {
        bool: {
          must: [
            { query: { bool: { should: taxonTerms }}},
          ],
        },
      },
    },
  };
  return assoc(query,
      ['query', 'bool', 'must'], [...query.query.bool.must || [], filter]
  );
}
