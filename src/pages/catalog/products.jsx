/* @flow */

// libs
import _ from 'lodash';
import React, { Component } from 'react';
import type { HTMLElement } from 'types';
import { browserHistory } from 'lib/history';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import * as actions from 'modules/products';
import { assetsUrl } from 'lib/env';
import { categoryNameToUrl, categoryNameFromUrl } from 'paragons/categories';
import { PAGE_SIZE, MAX_RESULTS } from 'modules/products';
import classNames from 'classnames';
import { update, deepMerge, assoc } from 'sprout-data';
import Select from 'ui/select/select';


// components
import ProductsList, { LoadingBehaviors } from '../../components/products-list/products-list';

import Facets from '@foxcomm/storefront-react/lib/components/core/facets/facets';
import Filters from '@foxcomm/storefront-react/lib/components/core/filters/filters';
import FilterGroup from '@foxcomm/storefront-react/lib/components/core/filters/filter-group';
import FilterCheckboxes from '@foxcomm/storefront-react/lib/components/core/filters/filter-checkboxes';
import FilterColors from '@foxcomm/storefront-react/lib/components/core/filters/filter-colors';

// styles
import styles from './products.css';

// types
import type { Route } from 'types';
import type { Facet, FacetValue } from 'types/facets';
import type { AbortablePromise } from 'types/promise';

type SelectedFacetsType = {
  [key: string]: Array<string>,
};

type FiltersType = {
  sorting: {
    direction: number,
    field: string,
  },
  toLoad: number,
  from: number,
}

const initialFilterValues: FiltersType = {
  sorting: {
    direction: 1,
    field: 'title',
  },
  from: 0,
  toLoad: PAGE_SIZE,
};

type State = {
  openMobileFilter: boolean,
  sortOption: string,
  facets: Array<Facet>,
};

type ColorValue = {
  color: string,
  value: string,
};

type Params = {
  categoryName: ?string,
};

type Category = {
  name: string,
  id: number,
  description: string,
};

type Props = {
  params: Params,
  list: Array<Object>,
  categories: ?Array<Category>,
  isLoading: boolean,
  fetch: Function,
  location: any,
  routes: Array<Route>,
  routerParams: Object,
  facets: Array<Facet>,
};

type ColorValue = {
  color: string,
  value: string,
};

function isFacetValueSelected(facets: ?Array<string>, value: string | ColorValue) {
  if (typeof value !== 'string') return _.includes(facets, value.value);
  return _.includes(facets, value);
}

function markFacetValuesAsSelected(facets: Array<Facet>, selectedFacets: Object): Array<Facet> {
  return _.map(facets, facetItem => ({
    ...facetItem,
    values: _.map(facetItem.values, (facetValueItem: FacetValue) => ({
      ...facetValueItem,
      selected: isFacetValueSelected(selectedFacets[facetItem.key], facetValueItem.value),
    })),
  }));
}

function mergeFacets(prevFacets, nextFacets, selectedFacets) {
  let facets = [];

  const groupPrev = _.groupBy(prevFacets, 'key');
  // The only time this should be empty is on first call.
  if (_.isEmpty(prevFacets)) {
    facets = nextFacets;
  } else {
    facets = _.reduce(nextFacets, (acc, v, k) => {
      if (!_.isEmpty(selectedFacets[v.key]) && !_.isEmpty(groupPrev[v.key])) {
        return [...acc, groupPrev[v.key][0]];
      }

      return [...acc, v];
    }, []);
  }

  return markFacetValuesAsSelected(facets, selectedFacets);
}

const facetWhitelist = [
  'CATEGORY',
];

const ASC = 1;
const DESC = -1;

const SORTING_ITEMS = [
  "Name: A to Z",
  "Name: Z to A",
  "Price: Lowest to Highest",
  "Price: Highest to Lowest",
];

// redux
const mapStateToProps = state => {
  const async = state.asyncActions.products;

  return {
    ...state.products,
    isLoading: !!async ? async.inProgress : true,
    categories: state.categories.list,
  };
};

class Products extends Component {
  props: Props;
  lastFetch: ?AbortablePromise<*>;
  filters: Filters = initialFilterValues;
  _facetsToBeApplied: ?SelectedFacetsType;

  state: State = {
    sortOption: "Name: A to Z",
    openMobileFilter: false,
    facets: mergeFacets([], this.props.facets, this.getSelectedFacets()),
  };

  fetch(props: Props = this.props): void {
    if (this.lastFetch && this.lastFetch.abort) {
      this.lastFetch.abort();
      this.lastFetch = null;
    }
    const categoryNames = this.getCategoryNames(props);
    const filters = this.filters;

    const selectedFacets = this.getSelectedFacets(props);

    this.lastFetch = this.props.fetch(
      categoryNames,
      selectedFacets,
      props.location.query.text,
      filters
    );
    this.lastFetch.catch(_.noop);
  }

  getSelectedFacets(props: Props = this.props): {[key: string]: Array<string>} {
    const { query } = props.location;

    return _.reduce(query, (acc, cur, key) => {
      if (key === 'text') return acc;

      const terms = _.map(_.isString(cur) ? [cur] : cur, value => decodeURIComponent(value).replace(/\+/g, ' '));
      return {
        ...acc,
        [key]: terms,
      };
    }, {});
  }

  componentWillMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.updateFetchFilters(this.filters, nextProps);
    if (this.props.facets != nextProps.facets) {
      this.setState({
        facets: mergeFacets(this.state.facets, nextProps.facets, this.getSelectedFacets(nextProps)),
      });
    }
  }

  getCategoryNames(props: Props = this.props): Array<string> {
    const { categoryName, subCategory, leafCategory } = props.params;
    return [categoryName, subCategory, leafCategory];
  }

  updateFetchFilters(nextFilters: Object, nextProps: ?Props) {
    // navigate in case of facets
    // set value
    let filters = this.filters;
    let newFilters = nextFilters;

    let changedCategoryNames = false;
    if (nextProps) {
      const categoryNames = this.getCategoryNames();
      const nextCategoryNames = this.getCategoryNames(nextProps);

      changedCategoryNames = !_.isEqual(categoryNames, nextCategoryNames);
    }

    let facetsChanged = false;
    if (nextProps) {
      const selectedFacets = this.getSelectedFacets();
      const nextSelectedFacets = this.getSelectedFacets(nextProps);

      facetsChanged = !_.isEqual(selectedFacets, nextSelectedFacets);
    }

    if (facetsChanged) {
      newFilters = assoc(newFilters, 'from', 0);
    }

    let queryTextChanged = false;
    if (nextProps) {
      queryTextChanged = this.props.location.query.text != nextProps.location.query.text;
    }

    if (changedCategoryNames) {
      filters = initialFilterValues;
    } else {
      Object.keys(newFilters).forEach(key => {
        filters = update(filters, key, deepMerge, newFilters[key]);
      });
    }
    const changedFilters = this.filters !== filters;
    this.filters = filters;

    if (changedFilters || changedCategoryNames || facetsChanged || queryTextChanged) {
      this.fetch(nextProps);
    }
  }

  @autobind
  newFacetSelectState(facet: string, value: string, selected: boolean) {
    const newSelection = this.getSelectedFacets();
    if (selected) {
      if (facet in newSelection) {
        newSelection[facet].push(value);
      } else {
        newSelection[facet] = [value];
      }
    } else if (facet in newSelection) {
      const values = newSelection[facet];
      newSelection[facet] = _.filter(values, (v) => {
        return v != value;
      });
    }
    return newSelection;
  }

  buildQuery(selectedFacets) {
    if (this.props.location.query.text) {
      return {
        ...selectedFacets,
        text: this.props.location.query.text,
      };
    }
    return selectedFacets;
  }

  @autobind
  onSelectFacet(facet: string, value: string, selected: boolean) {
    const selectedFacets = this.newFacetSelectState(facet, value, selected);

    this.updateFacets(selectedFacets);
  }

  updateFacets(newSelectedFacets) {
    // do optimistic update first
    const optimisticUpdatedFacets = markFacetValuesAsSelected(this.state.facets, newSelectedFacets);
    this.setState({
      facets: optimisticUpdatedFacets,
    });
    browserHistory.push({
      pathname: this.props.location.pathname,
      query: this.buildQuery(newSelectedFacets),
    });
  }

  @autobind
  clearFacet(facet: string) {
    const selectedFacets = _.omit(this.getSelectedFacets(), facet);

    this.updateFacets(selectedFacets);
  }

  renderHeader() {
    const props = this.props;
    const { categories } = props;
    const { categoryName } = props.params;

    const realCategoryName =
      decodeURIComponent(categoryName || '').toUpperCase().replace(/-/g, ' ');

    const category = _.find(categories, {
      name: realCategoryName,
    });

    if (!category || !categoryName) {
      return;
    }

    const description = (category && category.description && category.showNameCatPage)
      ? <p styleName="description">{category.description}</p>
      : '';

    const bgImageStyle = category.imageUrl ?
    { backgroundImage: `url(${assetsUrl(category.imageUrl)})` } : {};

    const className = `header-${categoryName}`;

    const title = (category.showNameCatPage)
      ? <h1 styleName="title">{category.name}</h1>
      : <h1 styleName="title">{category.description}</h1>;

    return (
      <header styleName={className}>
        <div styleName="header-wrap" style={bgImageStyle}>
          <div styleName="text-wrap">
            <span styleName="description">{description}</span>
            {title}
          </div>
        </div>
      </header>
    );
  }

  renderFilters(onSelectFacet = this.onSelectFacet) {
    return (
      <Filters
        filters={this.state.facets}
        onSelectFacet={onSelectFacet}
        onClearFacet={this.clearFacet}
      >
        <FilterGroup label="Product Type" term="producttype">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Color Group" term="colorGroup">
          <FilterColors />
        </FilterGroup>
        <FilterGroup label="Gender" term="gender">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Price" term="price">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Collection" term="collection">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Material" term="material">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Laptop Size" term="laptopSize">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Wheels" term="wheels">
          <FilterCheckboxes />
        </FilterGroup>
        <FilterGroup label="Exclusive Features" term="features">
          <FilterCheckboxes />
        </FilterGroup>
      </Filters>
    );
  }

  renderMobileFilters() {
    if (!this.state.openMobileFilter) return null;
    return (
      <div styleName="filters">
        <div>
          {this.renderFilters()}
          <button onClick={this.toggleMobileFilter} styleName="close-filters">CLOSE FILTERS</button>
        </div>
      </div>
    );
  }

  @autobind
  toggleMobileFilter() {
    this.setState({
      openMobileFilter: !this.state.openMobileFilter,
    });
  }

  renderFiltersWithMarkup() {
    if (this.props.facets.length == 0) {
      return null;
    };
    return (
      <div styleName="filters-holder">
        <div styleName="filters">
          <div>{this.renderFilters()}</div>
        </div>
      </div>
    );
  }

  renderProductList() {
    if (this.props.facets.length == 0) {
      return (
        <div styleName="product-list-nofilter">
          <ProductsList
            list={this.props.list}
            isLoading={this.props.isLoading}
            loadingBehavior={LoadingBehaviors.ShowWrapper}
          />
        </div>
      );
    };
    return (
      <div styleName="product-list">
        <ProductsList
          list={this.props.list}
          isLoading={this.props.isLoading}
          loadingBehavior={LoadingBehaviors.ShowWrapper}
        />
      </div>
    );
  }

  renderMobileArea() {
    if (this.props.facets.length == 0) {
      return null;
    };
    return (
      <div styleName="mobile-trigger-area">
        <button onClick={this.toggleMobileFilter} styleName="filters-trigger">
          FILTERS
          {this.state.openMobileFilter ? <i styleName="icon-up"></i> : <i styleName="icon-down"></i>}
        </button>
        <div styleName="sorting-trigger">
          <Select
            inputProps={{
              type: 'string',
            }}
            getItemValue={_.identity}
            items={SORTING_ITEMS}
            onSelect={this.onSort}
            selectedItem={this.state.sortOption}
            sortItems={false}
          />
          <i styleName="icon-down"></i>
        </div>
      </div>
    );
  }


  @autobind
  changeSorting(field?: string, direction?: number) {
    const newState = {
      field,
      direction,
    };

    this.updateFetchFilters({
      sorting: newState,
    });
  }

  @autobind
  onSort(val) {
    switch (val) {
      case 'Name: A to Z':
        this.changeSorting('title', ASC);
        break;
      case 'Name: Z to A':
        this.changeSorting('title', DESC);
        break;
      case 'Price: Lowest to Highest':
        this.changeSorting('salePrice', ASC);
        break;
      case 'Price: Highest to Lowest':
        this.changeSorting('salePrice', DESC);
        break;
      case 'None':
        this.changeSorting();
        break;
    };
    this.setState({
      sortOption: val,
    });
  }

  renderSorting() {
    if (this.props.facets.length == 0) {
      return null;
    };
    return (
      <div styleName="sorting">
        <div>Sort:</div>
        <div>
          <Select
            inputProps={{
              type: 'string',
            }}
            getItemValue={_.identity}
            items={SORTING_ITEMS}
            onSelect={this.onSort}
            selectedItem={this.state.sortOption}
            sortItems={false}
          />
        </div>
      </div>
    );
  }
  render(): HTMLElement {
    return (
      <section styleName="catalog">
        {this.renderHeader()}
        {this.renderMobileArea()}
        <div styleName="mobile-area">
          {this.renderMobileFilters()}
        </div>
        {this.renderSorting()}
        {this.renderFiltersWithMarkup()}
        {this.renderProductList()}
      </section>
    );
  }
}

export default connect(mapStateToProps, actions)(Products);
