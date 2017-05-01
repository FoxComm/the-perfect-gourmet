/* @flow */

import React from 'react';
import styles from './editable-block.css';

import localized from 'lib/i18n';
import type { Localized } from 'lib/i18n';

import type { HTMLElement } from 'types';

type EditableProps = Localized & {
  isEditing: boolean,
  collapsed?: boolean,
  editAllowed?: boolean,
  className?: string,
  content?: ?HTMLElement,
  children?: HTMLElement,
  editAction?: () => any,
  actionsContent?: HTMLElement|Array<HTMLElement>,
  title: string|HTMLElement,
  t: any,
  footnote?: HTMLElement
};

const EditableBlock = (props: EditableProps) => {
  const editLink = !props.isEditing && !props.collapsed && props.editAllowed
    ? <div onClick={props.editAction} styleName="action">{props.t('EDIT')}</div>
    : null;

  const actions = props.actionsContent || editLink;
  const content = !props.collapsed ? (props.content || props.children) : null;

  const { footnote, title, className } = props;

  const titleBlock = (
    <h3 styleName="title">
      {title}
    </h3>
  );

  const footnoteBlock = footnote ? (<div styleName="footnote">* {footnote}</div>) : null;

  return (
    <article styleName="editable-block" className={className}>
      <header styleName="header">
        {titleBlock}
        {actions}
      </header>
      {content}
      {footnoteBlock}
    </article>
  );
};

EditableBlock.defaultProps = {
  isEditing: false,
  collapsed: false,
  editAllowed: true,
};

export default localized(EditableBlock);
