/* eslint-disable no-unused-vars */
import utils from '../utils';
import labelProperties from './labelProperties';

/**
 * Type aliases for JSDoc references to types not imported as values in this file.
 *
 * @typedef {import('../template/Item').default} Item
 * @typedef {import('./Binding').default} Binding
 * @typedef {import('@entryscape/rdfjson').Graph} Graph
 * @typedef {import('@entryscape/rdfjson').Statement} Statement
 */

const generateUIDNotMoreThan1million = () =>
  `0000${((Math.random() * Math.pow(36, 4)) << 0).toString(36)}`.slice(-4);

const createURI = (item, parentBinding) => {
  const parentURI = parentBinding.getChildrenRootUri();
  const hash = parentURI.lastIndexOf('#');
  const newURIBase =
    hash === -1 ? `${parentURI}#` : parentURI.substring(0, hash + 1);
  const graph = parentBinding.getGraph()._graph;
  while (true) {
    const newURI = newURIBase + generateUIDNotMoreThan1million();
    if (graph[newURI] == null) {
      return newURI;
    }
  }
};

const getFallbackChoice = (item, value, seeAlso, graph) => {
  if (item.getNodetype() === 'URI' || item.getNodetype() === 'RESOURCE') {
    let lmap = utils.getLocalizedMap(
      graph,
      value,
      item.getURIValueLabelProperties()
    );
    if (!lmap) {
      const lastHash = value.lastIndexOf('#');
      const lastSlash = value.lastIndexOf('/');
      if (lastHash > 0 || lastSlash > 0) {
        lmap = {
          '': decodeURIComponent(
            value.substring(1 + (lastHash > lastSlash ? lastHash : lastSlash))
          ),
        };
      } else {
        lmap = { '': value };
      }
    }
    return { value, label: lmap };
  }
  return { value, label: value };
};

/**
 * This method is a default implementation, feel free to override with specific construction of matched choices.
 * Returns a choice object containing a value and a label.
 * Override this function to provide specific loading of a choice.
 * If you need to do this asynchonously provide a "load" method on the returned choice object.
 * To indicate that a matched value is not acceptable anymore,
 * set the flag mismatch to true in the returned choice object.
 *
 * @param {Item} item the RDForms template item matched against.
 * @param {string} value the value to match
 * @param {Statement} seeAlso if provided the value is a URI and a rdfs:seeAlso property has been found in the graph
 * @param {Graph} graph the RDF graph where the value was matched
 * @returns {object} an object containing a value, a label (object with language codes as attributes),
 * an optional load callback method and an optional mismatch flag.
 * @see openChoiceSelector
 */
const getChoice = (item, value, seeAlso, graph) =>
  getFallbackChoice(item, value, seeAlso, graph);
/**
 * This method is a fake implementation for launching a dialog for choosing system choices.
 * The method MUST be overridden if the template you use depends on system choices.
 * (System choices in a RDForm template choice items means that there are neither inline choices
 * or an ontology URL given in combination with provided cached choices for the given ontology URL).
 *
 * @param {Binding} binding the binding where the choice will be given
 * @param {(choice: object) => void} callback a method to call with a choice object when the user has selected an appropriate choice.
 */
const openChoiceSelector = (binding, callback) => {
  alert(
    'This alert is a placeholder for a search dialog that should be provided as part of the integration of ' +
      'RDForms into a wider system.\nSimply override the methods "getChoices" and "openChoiceSelector" in the ' +
      'system module.'
  );
  callback({
    value: 'http://example.com/choice1',
    label: { en: 'First choice', sv: 'Första valet' },
  });
};

/**
 * The implementor is expected to provide an application specific override
 * For example:
 * system.attachExternalLinkBehaviour = (node, binding) => node.setAttribute("target", "_blank");
 *
 * @returns {boolean} false in the default no-op implementation.
 */
const attachExternalLinkBehaviour = () => false;

/**
 * The implementor is expected to provide an application specific override
 * For example:
 * system.attachLinkBehaviour = (node, binding) => node.setAttribute("target", "_blank");
 *
 * @param {Node} node the DOM node representing the link.
 * @param {Binding} binding the binding the link was rendered from.
 * @returns {boolean} false in the default no-op implementation.
 */
const attachLinkBehaviour = (node, binding) => false;

const hasDnDSupport = (binding) => false;
const addDnD = (binding, node, onDrop) => ({});

export default {
  hasDnDSupport,
  addDnD,
  attachExternalLinkBehaviour,
  attachLinkBehaviour,
  openChoiceSelector,
  getChoice,
  getFallbackChoice,
  labelProperties,
  createURI,
};
