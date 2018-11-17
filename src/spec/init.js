import {renderForms} from './form';
import {renderNamespaces} from './namespaces';
import {renderVocabularies} from './vocab';
import {renderAppendixHeader} from './domUtils';
import template from './main.html';
import bundleLoader from '../template/bundleLoader';
import ItemStore from '../template/ItemStore';

export default (config, node) => {
  const itemStore = new ItemStore();
  const startNode = typeof node === 'string' ? document.getElementById(node) : node;
  startNode.innerHTML = template;
  bundleLoader(itemStore, config.bundles, (bundles) => {
    if (config.introduction) {
      document.getElementById('introText').innerHTML = config.introduction;
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
    renderVocabularies(document.getElementById('vocabs'), document.getElementById('toc-vocabs'));
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