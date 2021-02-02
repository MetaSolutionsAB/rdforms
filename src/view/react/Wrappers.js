import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Presenter from '../Presenter';
import Editor from '../Editor';
import ValidationPresenter from '../ValidationPresenter';

const fixIt = (Cls) => {
  const FixCls = class extends Cls {
    render() {
      if (this.initiatedAlready) {
        if (this.domNode.parent instanceof Node) {
          ReactDOM.unmountComponentAtNode(this.domNode.parent);
        }
        this.domNode.clear();
      }
      this.initiatedAlready = true;

      super.render();
      // eslint-disable-next-line no-unused-vars
      const Component = this.domNode.component;
      if (this.domNode.parent instanceof Node) {
        ReactDOM.render(<Component></Component>, this.domNode.parent);
      }
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
