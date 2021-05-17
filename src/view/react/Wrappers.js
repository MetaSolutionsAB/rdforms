import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Presenter from '../Presenter';
import Editor from '../Editor';
import ValidationPresenter from '../ValidationPresenter';

const fixIt = (Cls) => {
  const FixCls = class extends Cls {
    render() {
      this.domNode.clear();
      super.render();
      if (!this.initiatedAlready && this.domNode.parent instanceof Node) {
        // eslint-disable-next-line no-unused-vars
        const Cmp = this.domNode.component;
        ReactDOM.render(<Cmp></Cmp>, this.domNode.parent);
      }
      this.initiatedAlready = true;
    }
  };
  FixCls.Component = class extends Component {
    constructor(props) {
      super(props);
      this.fix = new FixCls(props);
    }
    render() {
      return this.fix.domNode.component;
    }
  };
  return FixCls;
};

const ReactEditor = fixIt(Editor);
const ReactPresenter = fixIt(Presenter);
const ReactValidationPresenter = fixIt(ValidationPresenter);

export { ReactEditor as Editor, ReactPresenter as Presenter, ReactValidationPresenter as ValidationPresenter };
