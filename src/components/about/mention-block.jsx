// libs
import React from 'react';

// styles
import styles from './mention-block.css';

const MentionBlock = ({ urlPrefix, mention }) => {
  const {
    avatarName,
    avatarExt,
    mentionText,
    author,
    location,
  } = mention;

  const url = `${urlPrefix}/${avatarName}`;

  return (
    <div styleName="mention">
      <img
        alt={avatarName}
        src={`${url}.${avatarExt}`}
        srcSet={`${url}@2x.${avatarExt} 2x, ${url}@2x.${avatarExt} 3x`}
        styleName="avatar"
      />
      <div styleName="text">{mentionText}</div>
      <div styleName="author">{author}</div>
      <div styleName="location">{location}</div>
    </div>
  );
};

export default MentionBlock;
