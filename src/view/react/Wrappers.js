import React from 'react';
import ReactDOM from 'react-dom';
import Presenter from '../Presenter';
import renderingContext from '../renderingContext';
import Editor from '../Editor';

const fixIt = (Cls) => {
  const FixCls = class extends Cls {
    render() {
      if (this.initiatedAlready) {
        if (this.domNode.parent instanceof Node) {
          ReactDOM.unmountComponentAtNode(struct.parent);
        }
        this.domNode.destroy();
        this.domNode = renderingContext.createDomNode(srcNodeRef, this);
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
  FixCls.Component = class Component extends React.Component {
    constructor(props) {
      super();
      this.presenterFix = new PresenterFix(props);
    }
    render() {
      return this.presenterFix.domNode.component;
    }
  };
  return FixCls;
};

const ReactEditor = fixIt(Editor);
const ReactPresenter = fixIt(Presenter);

export { ReactEditor as Editor, ReactPresenter as Presenter };
