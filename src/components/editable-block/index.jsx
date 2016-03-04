
/* @flow */

import React from 'react';
import cssModules from 'react-css-modules';
import styles from './index.css';

import type { HTMLElement } from '../../types';

type EditableProps = {
  isEditing: boolean;
  viewContent: ?HTMLElement|string;
  editContent: ?HTMLElement|string;
  editAction: () => any,
  title: string;
};

const EditableBlock = (props: EditableProps) => {
  const content = props.isEditing ? props.editContent : props.viewContent;

  const editLink = !props.isEditing ? <div onClick={props.editAction} styleName="edit">EDIT</div> : null;

  return (
    <div styleName="editable-block">
      <div styleName="header">
        <div styleName="title">{props.title}</div>
        {editLink}
      </div>
      <div styleName="content">{content}</div>
    </div>
  );
};

EditableBlock.defaulProps = {
  isEditing: false,
};

export default cssModules(EditableBlock, styles);
