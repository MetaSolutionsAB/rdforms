// Golden-HTML tests: each case pairs a small template + graph (the input data)
// with the exact HTML the vanilla flavor produces, so the data→markup mapping
// is visible and reviewable. Runs under the jsdom jest project.
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import { VanillaPresenter } from './all';

const RESOURCE = 'http://example.org/r';

const render = (source, graphData) => {
  const root = new ItemStore().createTemplate(source);
  const binding = match(new Graph(graphData), RESOURCE, root);
  const node = document.createElement('div');
  new VanillaPresenter({ binding, locale: 'en' }, node);
  return node.innerHTML;
};

const template = (...children) => ({
  root: 'root',
  auxilliary: [{ '@id': 'root', '@type': 'group', content: children }],
});

const text = (property, label, extra) => ({
  '@type': 'text',
  nodetype: 'LITERAL',
  property,
  label: { en: label },
  ...extra,
});

const NAME = 'http://xmlns.com/foaf/0.1/name';
const NICK = 'http://xmlns.com/foaf/0.1/nick';
const HOMEPAGE = 'http://xmlns.com/foaf/0.1/homepage';
const TITLE = 'http://purl.org/dc/terms/title';
const MAKER = 'http://xmlns.com/foaf/0.1/maker';
const FIRST = 'http://xmlns.com/foaf/0.1/firstName';
const LAST = 'http://xmlns.com/foaf/0.1/lastName';

const CASES = {
  single: [
    template(text(NAME, 'Name')),
    { [RESOURCE]: { [NAME]: [{ value: 'Ada', type: 'literal' }] } },
  ],
  repeated: [
    template(text(NICK, 'Alias', { cardinality: { min: 0, pref: 1, max: 3 } })),
    {
      [RESOURCE]: {
        [NICK]: [
          { value: 'Ada', type: 'literal' },
          { value: 'Ida', type: 'literal' },
        ],
      },
    },
  ],
  uri: [
    template(text(HOMEPAGE, 'Homepage', { nodetype: 'URI' })),
    {
      [RESOURCE]: {
        [HOMEPAGE]: [{ value: 'http://example.org/', type: 'uri' }],
      },
    },
  ],
  language: [
    template(text(TITLE, 'Title', { nodetype: 'LANGUAGE_LITERAL' })),
    {
      [RESOURCE]: {
        [TITLE]: [
          { value: 'Hi', type: 'literal', lang: 'en' },
          { value: 'Hej', type: 'literal', lang: 'sv' },
        ],
      },
    },
  ],
  heading: [
    {
      root: 'root',
      auxilliary: [
        { '@id': 'root', '@type': 'group', content: ['person'] },
        {
          '@id': 'person',
          '@type': 'group',
          styles: ['heading'],
          label: { en: 'Person' },
          content: [text(NAME, 'Name')],
        },
      ],
    },
    { [RESOURCE]: { [NAME]: [{ value: 'Ada', type: 'literal' }] } },
  ],
  table: [
    template({
      '@type': 'group',
      styles: ['table'],
      nodetype: 'RESOURCE',
      property: MAKER,
      label: { en: 'Makers' },
      content: [text(FIRST, 'First name'), text(LAST, 'Last name')],
    }),
    {
      [RESOURCE]: { [MAKER]: [{ value: '_:p1', type: 'bnode' }] },
      '_:p1': {
        [FIRST]: [{ value: 'Ada', type: 'literal' }],
        [LAST]: [{ value: 'Lovelace', type: 'literal' }],
      },
    },
  ],
};

// Collapse whitespace between tags so the expected HTML can be written
// readably across multiple indented lines; text content is preserved.
const normalize = (html) => html.replace(/>\s+</g, '><').trim();

// Each case renders CASES[name] and asserts the exact produced HTML.
const goldenHtml = (name) => normalize(render(...CASES[name]));

describe('vanilla flavor — generated HTML for given data', () => {
  test('a single text property → dt label + dd value', () => {
    expect(goldenHtml('single')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Name</dt>
         <dd class="rdforms-value">Ada</dd>
       </dl>`)
    );
  });

  test('repeated values → one dt, a dd per value', () => {
    expect(goldenHtml('repeated')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Alias</dt>
         <dd class="rdforms-value">Ada</dd>
         <dd class="rdforms-value">Ida</dd>
       </dl>`)
    );
  });

  test('a URI value → an anchor', () => {
    expect(goldenHtml('uri')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Homepage</dt>
         <dd class="rdforms-value"><a class="rdforms-link" href="http://example.org/">http://example.org/</a></dd>
       </dl>`)
    );
  });

  test('a language literal → dd tagged with lang (locale-filtered to en)', () => {
    expect(goldenHtml('language')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Title</dt>
         <dd class="rdforms-value" lang="en">Hi</dd>
       </dl>`)
    );
  });

  test('a heading-styled group → section + h2, content below', () => {
    expect(goldenHtml('heading')).toBe(
      normalize(`<section class="rdforms-section">
         <h2 class="rdforms-heading">Person</h2>
         <div class="rdforms-section-body rdforms rdforms-presenter compact">
           <dl class="rdforms-group">
             <dt class="rdforms-label">Name</dt>
             <dd class="rdforms-value">Ada</dd>
           </dl>
         </div>
       </section>`)
    );
  });

  test('a table-styled group → semantic table', () => {
    expect(goldenHtml('table')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Makers</dt>
         <dd class="rdforms-group-value">
           <table class="rdforms-table">
             <caption>Makers</caption>
             <thead><tr><th scope="col">First name</th><th scope="col">Last name</th></tr></thead>
             <tbody><tr><td>Ada</td><td>Lovelace</td></tr></tbody>
           </table>
         </dd>
       </dl>`)
    );
  });
});
