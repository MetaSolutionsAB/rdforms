// Golden-HTML tests: each case pairs a small template + graph (the input data)
// with the exact HTML the vanilla flavor produces, so the data→markup mapping
// is visible and reviewable. Runs under the jsdom jest project.
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import { VanillaPresenter } from './all';

const RESOURCE = 'http://example.org/r';

const render = (source, graphData, viewParams = {}) => {
  const root = new ItemStore().createTemplate(source);
  const binding = match(new Graph(graphData), RESOURCE, root);
  const node = document.createElement('div');
  new VanillaPresenter({ binding, locale: 'en', ...viewParams }, node);
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
const GIVEN = 'http://xmlns.com/foaf/0.1/givenName';

const CASES = {
  single: [
    template(text(NAME, 'Name')),
    { [RESOURCE]: { [NAME]: [{ value: 'Ada', type: 'literal' }] } },
  ],
  described: [
    template(text(NAME, 'Name', { description: { en: "A person's name" } })),
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
  image: [
    template(text(HOMEPAGE, 'Photo', { nodetype: 'URI', styles: ['image'] })),
    {
      [RESOURCE]: {
        [HOMEPAGE]: [{ value: 'http://example.org/p.jpg', type: 'uri' }],
      },
    },
  ],
  duration: [
    template(
      text(TITLE, 'Duration', {
        nodetype: 'DATATYPE_LITERAL',
        datatype: 'xsd:duration',
      })
    ),
    {
      [RESOURCE]: {
        [TITLE]: [
          {
            value: 'P5Y2M10DT15H',
            type: 'literal',
            datatype: 'http://www.w3.org/2001/XMLSchema#duration',
          },
        ],
      },
    },
  ],
  durationSingle: [
    template(
      text(TITLE, 'Duration', {
        nodetype: 'DATATYPE_LITERAL',
        datatype: 'xsd:duration',
      })
    ),
    {
      [RESOURCE]: {
        [TITLE]: [
          {
            value: 'P5Y',
            type: 'literal',
            datatype: 'http://www.w3.org/2001/XMLSchema#duration',
          },
        ],
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
  deepHeading: [
    {
      root: 'root',
      auxilliary: [
        { '@id': 'root', '@type': 'group', content: [{ '@id': 'levelA' }] },
        {
          '@id': 'levelA',
          '@type': 'group',
          styles: ['heading'],
          label: { en: 'Level A' },
          content: [text(NAME, 'A name'), { '@id': 'levelB' }],
        },
        {
          '@id': 'levelB',
          '@type': 'group',
          styles: ['heading'],
          label: { en: 'Level B' },
          content: [text(NICK, 'B name'), { '@id': 'levelC' }],
        },
        {
          '@id': 'levelC',
          '@type': 'group',
          styles: ['heading'],
          label: { en: 'Level C' },
          content: [text(GIVEN, 'C name')],
        },
      ],
    },
    {
      [RESOURCE]: {
        [NAME]: [{ value: 'Top', type: 'literal' }],
        [NICK]: [{ value: 'Middle', type: 'literal' }],
        [GIVEN]: [{ value: 'Deep', type: 'literal' }],
      },
    },
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
  // Three property rows; the second (Alias) is multi-valued. Used with
  // { truncate: true, truncateLimit: 2 } to exercise row-level truncation:
  // Name + Alias shown (Alias keeps both values), Homepage held as overflow.
  manyRows: [
    template(
      text(NAME, 'Name'),
      text(NICK, 'Alias', { cardinality: { min: 0, pref: 1, max: 3 } }),
      text(HOMEPAGE, 'Homepage', { nodetype: 'URI' })
    ),
    {
      [RESOURCE]: {
        [NAME]: [{ value: 'Ada', type: 'literal' }],
        [NICK]: [
          { value: 'Ada', type: 'literal' },
          { value: 'Ida', type: 'literal' },
        ],
        [HOMEPAGE]: [{ value: 'http://example.org/', type: 'uri' }],
      },
    },
  ],
};

// Collapse whitespace between tags so the expected HTML can be written
// readably across multiple indented lines; text content is preserved.
const normalize = (html) => html.replace(/>\s+</g, '><').trim();

// Each case renders CASES[name] and asserts the exact produced HTML.
const goldenHtml = (name, viewParams) =>
  normalize(render(...CASES[name], viewParams));

describe('vanilla flavor — generated HTML for given data', () => {
  test('a single text property → dt label + dd value', () => {
    expect(goldenHtml('single')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Name</dt>
         <dd class="rdforms-value">Ada</dd>
       </dl>`)
    );
  });

  test('showDescription renders the description inline (non-compact)', () => {
    expect(
      goldenHtml('described', { showDescription: true, compact: false })
    ).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label" title="A person's name">Name<div class="rdforms-description">A person's name</div></dt>
         <dd class="rdforms-value">Ada</dd>
       </dl>`)
    );
  });

  test('showDescription is suppressed for a compact field (title only)', () => {
    // compact defaults to true; the inline description is suppressed like the
    // other flavors, leaving only the title tooltip.
    expect(goldenHtml('described', { showDescription: true })).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label" title="A person's name">Name</dt>
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

  test('an image-styled URI → img with src and alt from the field label', () => {
    expect(goldenHtml('image')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Photo</dt>
         <dd class="rdforms-value"><img class="rdforms-image" src="http://example.org/p.jpg" alt="Photo"></dd>
       </dl>`)
    );
  });

  test('a duration → a <time datetime> wrapping one span per non-zero part', () => {
    expect(goldenHtml('duration')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Duration</dt>
         <dd class="rdforms-value">
           <time datetime="P5Y2M10DT15H">
             <span class="rdforms-duration-part">Years: 5</span>
             <span class="rdforms-duration-part">Months: 2</span>
             <span class="rdforms-duration-part">Days: 10</span>
             <span class="rdforms-duration-part">Hours: 15</span>
           </time>
         </dd>
       </dl>`)
    );
    // The parts are separated by a real space in the DOM, so they read
    // correctly with no stylesheet. normalize() above collapses inter-tag
    // whitespace, so assert the raw output keeps the separator.
    expect(render(...CASES.duration)).toContain('</span> <span');
  });

  test('a single-part duration → one span with no separator space', () => {
    expect(goldenHtml('durationSingle')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Duration</dt>
         <dd class="rdforms-value">
           <time datetime="P5Y">
             <span class="rdforms-duration-part">Years: 5</span>
           </time>
         </dd>
       </dl>`)
    );
    // Only one part, so no separator space is added.
    expect(render(...CASES.durationSingle)).not.toContain('</span> <span');
  });

  test('a language literal → dd tagged with lang + visible language span (locale-filtered to en)', () => {
    expect(goldenHtml('language')).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Title</dt>
         <dd class="rdforms-value" lang="en">Hi <span class="rdforms-language">en</span></dd>
       </dl>`)
    );
  });

  test('showLanguage:false keeps the lang attribute but drops the visible span', () => {
    expect(goldenHtml('language', { showLanguage: false })).toBe(
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

  test('deeply nested heading groups → h2/h3/h4 outline', () => {
    expect(goldenHtml('deepHeading')).toBe(
      normalize(`<section class="rdforms-section">
         <h2 class="rdforms-heading">Level A</h2>
         <div class="rdforms-section-body rdforms rdforms-presenter compact">
           <dl class="rdforms-group">
             <dt class="rdforms-label">A name</dt>
             <dd class="rdforms-value">Top</dd>
           </dl>
           <section class="rdforms-section">
             <h3 class="rdforms-heading">Level B</h3>
             <div class="rdforms-section-body rdforms rdforms-presenter compact">
               <dl class="rdforms-group">
                 <dt class="rdforms-label">B name</dt>
                 <dd class="rdforms-value">Middle</dd>
               </dl>
               <section class="rdforms-section">
                 <h4 class="rdforms-heading">Level C</h4>
                 <div class="rdforms-section-body rdforms rdforms-presenter compact">
                   <dl class="rdforms-group">
                     <dt class="rdforms-label">C name</dt>
                     <dd class="rdforms-value">Deep</dd>
                   </dl>
                 </div>
               </section>
             </div>
           </section>
         </div>
       </section>`)
    );
  });

  test('headingLevel param sets the start level and deepens per nesting (h4→h5→h6)', () => {
    expect(normalize(render(...CASES.deepHeading, { headingLevel: 4 }))).toBe(
      normalize(`<section class="rdforms-section">
         <h4 class="rdforms-heading">Level A</h4>
         <div class="rdforms-section-body rdforms rdforms-presenter compact">
           <dl class="rdforms-group">
             <dt class="rdforms-label">A name</dt>
             <dd class="rdforms-value">Top</dd>
           </dl>
           <section class="rdforms-section">
             <h5 class="rdforms-heading">Level B</h5>
             <div class="rdforms-section-body rdforms rdforms-presenter compact">
               <dl class="rdforms-group">
                 <dt class="rdforms-label">B name</dt>
                 <dd class="rdforms-value">Middle</dd>
               </dl>
               <section class="rdforms-section">
                 <h6 class="rdforms-heading">Level C</h6>
                 <div class="rdforms-section-body rdforms rdforms-presenter compact">
                   <dl class="rdforms-group">
                     <dt class="rdforms-label">C name</dt>
                     <dd class="rdforms-value">Deep</dd>
                   </dl>
                 </div>
               </section>
             </div>
           </section>
         </div>
       </section>`)
    );
  });

  test('nesting past h6 is capped at h6 (start at 5 → h5/h6/h6, not h5/h6/h7)', () => {
    expect(normalize(render(...CASES.deepHeading, { headingLevel: 5 }))).toBe(
      normalize(`<section class="rdforms-section">
         <h5 class="rdforms-heading">Level A</h5>
         <div class="rdforms-section-body rdforms rdforms-presenter compact">
           <dl class="rdforms-group">
             <dt class="rdforms-label">A name</dt>
             <dd class="rdforms-value">Top</dd>
           </dl>
           <section class="rdforms-section">
             <h6 class="rdforms-heading">Level B</h6>
             <div class="rdforms-section-body rdforms rdforms-presenter compact">
               <dl class="rdforms-group">
                 <dt class="rdforms-label">B name</dt>
                 <dd class="rdforms-value">Middle</dd>
               </dl>
               <section class="rdforms-section">
                 <h6 class="rdforms-heading">Level C</h6>
                 <div class="rdforms-section-body rdforms rdforms-presenter compact">
                   <dl class="rdforms-group">
                     <dt class="rdforms-label">C name</dt>
                     <dd class="rdforms-value">Deep</dd>
                   </dl>
                 </div>
               </section>
             </div>
           </section>
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
             <thead>
               <tr>
                 <th scope="col">First name</th>
                 <th scope="col">Last name</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>Ada</td>
                 <td>Lovelace</td>
               </tr>
             </tbody>
           </table>
         </dd>
       </dl>`)
    );
  });

  test('truncation: more rows than the limit → first N property rows shown, overflow held, Show more button after the dl', () => {
    // truncateLimit counts <dt> rows: Name + Alias shown (Alias keeps BOTH its
    // values), Homepage is the overflow row and is absent from the initial DOM.
    expect(goldenHtml('manyRows', { truncate: true, truncateLimit: 2 })).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Name</dt>
         <dd class="rdforms-value">Ada</dd>
         <dt class="rdforms-label">Alias</dt>
         <dd class="rdforms-value">Ada</dd>
         <dd class="rdforms-value">Ida</dd>
       </dl>
       <button type="button" class="rdforms-show-more" aria-expanded="false">Show more</button>`)
    );
  });

  test('truncation: rows within the limit → every row rendered, no button', () => {
    expect(goldenHtml('manyRows', { truncate: true, truncateLimit: 5 })).toBe(
      normalize(`<dl class="rdforms-group">
         <dt class="rdforms-label">Name</dt>
         <dd class="rdforms-value">Ada</dd>
         <dt class="rdforms-label">Alias</dt>
         <dd class="rdforms-value">Ada</dd>
         <dd class="rdforms-value">Ida</dd>
         <dt class="rdforms-label">Homepage</dt>
         <dd class="rdforms-value"><a class="rdforms-link" href="http://example.org/">http://example.org/</a></dd>
       </dl>`)
    );
  });

  test('truncation: a noTruncate group style overrides truncate → no truncation, no button', () => {
    const source = {
      root: 'root',
      auxilliary: [
        {
          '@id': 'root',
          '@type': 'group',
          styles: ['noTruncate'],
          content: [
            text(NAME, 'Name'),
            text(NICK, 'Alias', { cardinality: { min: 0, pref: 1, max: 3 } }),
            text(HOMEPAGE, 'Homepage', { nodetype: 'URI' }),
          ],
        },
      ],
    };
    const html = normalize(
      render(source, CASES.manyRows[1], { truncate: true, truncateLimit: 2 })
    );
    expect(html).not.toContain('rdforms-show-more');
    expect(html).toContain('<dt class="rdforms-label">Homepage</dt>');
  });

  test('truncation: an item-level `truncate` group style enables truncation without the view-level flag', () => {
    const source = {
      root: 'root',
      auxilliary: [
        {
          '@id': 'root',
          '@type': 'group',
          styles: ['truncate'],
          content: [
            text(NAME, 'Name'),
            text(NICK, 'Alias', { cardinality: { min: 0, pref: 1, max: 3 } }),
            text(HOMEPAGE, 'Homepage', { nodetype: 'URI' }),
          ],
        },
      ],
    };
    // truncateLimit only — no view-level `truncate`; the group style enables it.
    const html = normalize(
      render(source, CASES.manyRows[1], { truncateLimit: 2 })
    );
    expect(html).toContain('rdforms-show-more');
    expect(html).toContain('<dt class="rdforms-label">Name</dt>');
    expect(html).toContain('<dt class="rdforms-label">Alias</dt>');
    expect(html).not.toContain('<dt class="rdforms-label">Homepage</dt>');
  });
});
