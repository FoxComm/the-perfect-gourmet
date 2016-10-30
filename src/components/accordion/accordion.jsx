/* @flow */

// libs
import React, { Component } from 'react';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

// styles
import styles from './accordion.css';

type Props = {
  isCollapsed: boolean,
  title: string,
  children?: any,
};

type State = {
  isCollapsed: boolean,
};

class Accordion extends Component {
  props: Props;

  static defaultProps = {
    isCollapsed: true,
  };

  state: State = {
    isCollapsed: this.props.isCollapsed,
  };

  @autobind
  toggleCollapsed() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render() {
    const modifiers = classNames({
      [styles._collapsed]: this.state.isCollapsed,
    });

    return (
      <article styleName="accordion" className={modifiers}>
        <h4 styleName="title" onClick={this.toggleCollapsed}>{this.props.title}</h4>
        <div styleName="content">{this.props.children}</div>
      </article>
    );
  }
}

export default Accordion;
