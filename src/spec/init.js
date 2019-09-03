import {renderForms} from './form';
import {renderNamespaces} from './namespaces';
import {renderVocabularies} from './vocab';
import {renderAppendixHeader} from './domUtils';
import mainTemplate from './main.html';
import navTemplate from './nav.html';
import bundleLoader from '../template/bundleLoader';
import ItemStore from '../template/ItemStore';
import { i18n } from 'esi18n';
import specNLS from "./nls/spec.nls";
import { template } from "lodash-es";
import { namespaces } from "rdfjson";

export default (config, nav, main) => {
  if (config.namespaces) {
    namespaces.add(config.namespaces);
  }
  if (config.language) {
    i18n.setLocale(config.language);
  }
  const itemStore = new ItemStore();
  let navNode = typeof nav === 'string' ? document.getElementById(nav) : nav;
  let mainNode = typeof main === 'string' ? document.getElementById(main) : main;
  if (!navNode) {
    navNode = document.getElementsByTagName('nav')[0];
    if (!navNode) {
      navNode = document.createElement('nav');
      document.body.appendChild(navNode);
    }
  }
  navNode.id = 'toc';
  if (!mainNode) {
    mainNode = document.getElementsByTagName('main')[0];
    if (!mainNode) {
      mainNode = document.createElement('main');
      document.body.appendChild(mainNode);
    }
  }
  let sectionNode;
  const sectionNodes = document.querySelectorAll('main section');
  if (sectionNodes.length > 0) {
    sectionNode = sectionNodes[0];
  }

  const bundle = i18n.getLocalization(specNLS);
  navNode.innerHTML = template(navTemplate)(bundle);
  mainNode.innerHTML = template(mainTemplate)(bundle);
  bundleLoader(itemStore, config.bundles, (bundles) => {
    if (config.introduction) {
      document.getElementById('introText').innerHTML = config.introduction;
    } else if (sectionNode) {
      document.getElementById('introText').appendChild(sectionNode);
    }
    const aps = document.getElementById('aps');
    const tocAps = document.getElementById('toc-aps');
    const sup = document.getElementById('sup');
    const tocSup = document.getElementById('toc-sup');

    renderForms({
        items: config.main.map(id => itemStore.getItem(id)),
        node: aps,
        nodeToc: tocAps
      },
      {
        items: config.supportive.map(id => itemStore.getItem(id)),
        node: sup,
        nodeToc: tocSup,
      });
    renderNamespaces(document.getElementById('nss'));
    renderVocabularies(document.getElementById('vocs'), document.getElementById('toc-vocabs'));
    const appendicies = document.querySelectorAll('[data-rdforms-appendix]');
    if (appendicies.length > 0) {
      document.getElementById("toc-appendicies-li").style.display = null;
      document.getElementById("appendicies-content").style.display = null;
      const ixes = document.getElementById('ixes');
      const tocIxes = document.getElementById('toc-appendicies');
      appendicies.forEach((apx) => {
        const name = apx.getAttribute('data-rdforms-appendix');
        renderAppendixHeader(name, ixes, tocIxes);
        ixes.appendChild(apx);
      });
    }
  });
};