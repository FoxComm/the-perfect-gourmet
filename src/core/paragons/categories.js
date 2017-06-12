/* @flow */

import _ from 'lodash';

function fromParts(parts: Array<string>): string {
  return _.reduce(parts, (acc, part) => {
    return acc.concat(` ${_.upperFirst(part)}`);
  }, '');
}

function categoryNameToUrl(categoryName: string): string {
  return encodeURIComponent(_.toLower(categoryName).replace(/\s/g, '+'));
}

function categoryNameFromUrl(url: string): string {
  const decoded = decodeURIComponent(url).split('+');
  return fromParts(decoded);
}

function humanize(name: string, sep: string = ' '): string {
  return fromParts(name.split(sep));
}

export {
  categoryNameToUrl,
  categoryNameFromUrl,
  humanize,
};
