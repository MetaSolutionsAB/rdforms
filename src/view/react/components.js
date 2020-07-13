/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import renderingContext from '../renderingContext';
import './labels';
import './text';
import './choice';
import './buttons';
import './date';

/**
 * Utility to toggle a set of classes potentially separated by spaces in a set.
 */
const toggleClass = (clsSet, clsStr, addOrNot) => {
  clsStr.split(' ').forEach((cls) => {
    if (addOrNot) {
      clsSet.add(cls);
    } else {
      clsSet.delete(cls);
    }
  });
};

// Utility to see if selector is among the classes
const selectorInClasses = (selector, clsSet) => clsSet.has(selector.substr(1));
// Utility to find struct in children based on selector
const findStruct = (selector, children) =>
  children.find(comp => comp.component && comp.domQuery(selector) !== undefined);

// Trivial utility to update an object and return it
const updateObjAttr = (obj, attr, value) => {
  if (value) {
    obj[attr] = value;
  } else {
    delete obj[attr];
  }
  return obj;
};

/**
 * A struct must be allowed to be created, modified and allow new substructures to be added both before and
 * after rendered by react. This is the reason for methods being declared first and later being overridden
 * in the useEffect call in the component method with empty array of dependencies
 * (i.e. it is only being called first time).
 * Note that all update of state variables are done by replacing the value (even for arrays and sets) to allow
 * correct diffing of react.
 */
const newStruct = (Tag, parent) => {
  const firstClsSet = new Set();
  const firstChildArr = [];
  let firstTextStr;
  const firstAttrs = {};
  const ext = {
    parent,

    // -- START: Initial methods used before react kicks in.
    toggleClass: (clsStr, addOrNot) => toggleClass(firstClsSet, clsStr, addOrNot),
    domQuery: selector => (selectorInClasses(selector, firstClsSet) ? ext : findStruct(selector, firstChildArr)),
    appendChild: struct => firstChildArr.push(struct),
    appendAfter: (struct, sibling) => firstChildArr.splice(firstChildArr.indexOf(sibling) + 1, 0, struct),
    text: (str) => { firstTextStr = str; },
    attr: (attr, value) => updateObjAttr(firstAttrs, attr, value),
    // -- END

    // Utility method, always works
    destroy: () => ext.parent.removeChild(ext),

    component: () => {
      let [clsSet, setCls] = useState(firstClsSet);
      let [childArr, setChildArr] = useState(firstChildArr);
      const [text, setText] = useState(firstTextStr);
      let [attrs, setAttrs] = useState(firstAttrs);

      // -- START: Override with react hook friendly methods that utilizes the current state and set methods.
      useEffect(() => {
        ext.toggleClass = (clsStr, addOrNot) => {
          clsSet = new Set(clsSet); // (*)
          toggleClass(clsSet, clsStr, addOrNot);
          setCls(clsSet);
        };
        ext.domQuery = selector => (selectorInClasses(selector, clsSet) ? ext : findStruct(selector, childArr));
        ext.appendChild = (struct) => {
          childArr = childArr.concat([struct]); // (*)
          setChildArr(childArr);
        };
        ext.appendAfter = (struct, sibling) => {
          childArr = childArr.slice(0); // (*)
          childArr.splice(childArr.indexOf(sibling), 0, struct);
          setChildArr(childArr);
        };
        ext.text = str => setText(str);
        ext.removeChild = (struct) => {
          childArr = childArr.slice(0); // (*)
          childArr.splice(childArr.indexOf(struct), 1);
          setChildArr(childArr);
        };
        ext.attr = (attr, value) => {
          attrs = updateObjAttr(Object.assign({}, attrs), attr, value); // (*)
          setAttrs(attrs);
        };
      }, []);
      // *) Due to initialization phase (when creating tree from binding tree) being quicker than rendering updates
      // we have to keep a reference to the latest array available from the closure. Also to be efficient these
      // overridden methods are placed inside of a useEffect that runs only initially, hence the redraw will not affect
      // this code and the closure references will never update unless we do it manually.
      // TODO: this may imply that this code is better rewritten as a class component instead of being driven by hooks.
      // -- END

      return <Tag className={clsSet.join(' ')}>{childArr.map((struct, index) =>
        <React.Fragment key={index}>{struct.component ? React.createElement(struct.component) :
          struct}</React.Fragment>)}{text}</Tag>;
    },
  };
  return ext;
};

renderingContext.domQuery = (selector, struct) => struct.domQuery(selector);

renderingContext.domCreate = (nodeStr, parentStruct) => {
  const struct = newStruct(nodeStr, parentStruct);
  parentStruct.appendChild(struct);
  return struct;
};

renderingContext.domCreateAfter = (nodeStr, siblingStruct) => {
  if (siblingStruct.parent) {
    const struct = newStruct(nodeStr, siblingStruct.parent);
    siblingStruct.parent.appendAfter(struct, siblingStruct);
    return struct;
  }
  return undefined;
};

renderingContext.domSetAttr = (struct, attr, value) => struct.attr(attr, value);

renderingContext.domText = (struct, text) => struct.text(text);

renderingContext.domClassToggle = (struct, classStr, addOrRemove = true) => struct.toggleClass(classStr, addOrRemove);

/**
 * Create a struct rather than a domNode.
 * @param srcNodeRef - can be a struct, a string or a dom node.
 */
renderingContext.createDomNode = (srcNodeRef /* , view */) => {
  let domNode;
  if (srcNodeRef?.component) {
    return srcNodeRef;
  } else if (srcNodeRef instanceof Node) {
    domNode = srcNodeRef;
  } else if (typeof srcNodeRef === 'string') {
    domNode = document.getElementById(srcNodeRef);
  } else {
    domNode = newStruct('div');
  }
  return newStruct('div', domNode);
};

/**
 * If we are in a toplevel struct, destroy it otherwise just call destroy on the struct.
 * @param struct
 */
renderingContext.destroyDomNode = (struct /* , view */) => {
  if (struct.component) {
    struct.destroy();
  }
};


renderingContext.prePresenterViewRenderer = () => {};

renderingContext.materialVariant = 'standard';

renderingContext.preEditorRenderer = (fieldDiv, binding, context) => {
  context.controlDiv = newStruct('div', fieldDiv);
  renderingContext.domClassToggle(context.controlDiv, 'rdformsFieldControl');
  if (binding.getItem().getType() !== 'group' && context.noCardinalityButtons !== true) {
    // eslint-disable-next-line no-unused-vars
    const RemoveButton = renderingContext.addRemoveButton(fieldDiv, binding, context);
    context.controlDiv.appendChild(<RemoveButton></RemoveButton>);
  }
};

renderingContext.postEditorRenderer = (fieldDiv, binding, context) => {
  fieldDiv.appendChild(context.controlDiv);
};

