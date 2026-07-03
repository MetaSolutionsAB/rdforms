# RDForms

RDForms (aka RDF Forms) is a JavaScript library that uses templates to describe how to edit, present and validate RDF. The library is intended to be used in web applications to ease the burden of developers to deal natively with RDF.

RDForms is designed to be adaptable to different UI libraries. Integrations ("flavors") are provided for:

- React (with Material UI)
- Bootstrap 4
- jQuery
- Vanilla — semantic HTML with no JavaScript library and no CSS framework (presentation only; see the "Vanilla presentation flavor" section below)

Deeper documentation for RDForms can be found at [rdforms.org](https://rdforms.org).

## Templates

The templates that drives RDForms are expressed as JSON structures. Templates can be divided into profile-level and field-level templates. A typical scenario is that a template author combines a set of field-level templates into a bigger profile-level template to meet a specific need. Such a profile-level template could correspond to well known application profiles (for example a dataset according the W3C Recommendation DCAT2) or correspond to a specific class in an ontology defined for a specific purpose in a project. Field-level templates are often reused across profiles but may require tweaking in various ways, for instance changing a label, restricting cardinality, refining a constraint etc. For this purpose there is an extension mechanism that allows tweaks to be made without forcing the template author to fork the template by making a full copy.

Read more about the templates in the [reference guide at the documentation site](https://rdforms.org/#!templateReference.md).

## How to use RDForms

In addition to the RDForms library you need to load the RDF library rdfjson and then initialize an Editor, Presenter or Validator on a DOM node. Below is a high-level example, for more detailed information on how to prepare the parameters look at the examples.

```html
<script type="text/javascript" src="https://unpkg.com/@entryscape/rdfjson@2.3.0/dist/rdfjson.js"></script>
<script type="text/javascript" src="https://unpkg.com/@entryscape/rdforms@10.0.0/dist/rdforms.react.js"></script>
<script type="module">
    // Make sure to provide the parameters graph, resource and template
    new Editor({ graph, resource, template }, 'node_id');
<script>
```

The exact versions above (2.3.0 and 10.0.0) may vary, please check for yourself the latest versions in package.json. Naturally you can also use the built version in the dist folder, see the next section.

## Installing and building

Before you can install dependencies and build RDForms you need to make sure you have [nodejs](http://nodejs.org/), [npm](https://www.npmjs.org/) and [pnpm](https://pnpm.io/) installed in your system. To install dependencies for RDForms:

```console
pnpm install
```

To build RDForms:

```console
pnpm build:all
```

## Samples

A good way to see the capabilities of RDForms is to take a look at the samples (generated from the examples, see section below). To generate the samples just run:

```console
pnpm build:samples
```

This will build the samples in the `samples` directory. You'd need a web server to serve the samples. We provide a simple one for your convenience:

```console
pnpm serve:samples
```

Your browser should open automatically, otherwise access the samples at [http://localhost:8080/](http://localhost:8080/).

## Tests

Unit tests run on [Jest](https://jestjs.io/) and live next to the source as `*.test.js` files (model/template logic under `src/model` and `src/template`, the view flavors under `src/view`). Run them with:

```console
pnpm test
```

or in watch mode:

```console
pnpm test:watch
```

Jest is configured as two projects: a `node` project for the model/template logic and a `jsdom` project for the view layer (`src/view/**`), so the generated presentation HTML can be asserted against real DOM.

### Smoke test (all flavors × examples)

`pnpm test:smoke` is a headless end-to-end check that guards against a flavor breaking one of the examples. It starts the all-flavors dev server in-process and, using Playwright, loads every flavor × example page and asserts that each renders into `#node` with no uncaught exceptions and no application console errors. It exits non-zero if any cell fails.

It needs the Playwright Chromium browser once:

```console
pnpm exec playwright install chromium
pnpm test:smoke
```

The smoke test is local-only (not part of CI).

## Development

You can develop the different UI libraries as well as the part of the generic code base by running the examples in the webpack-dev-server:

```js
pnpm dev:react
```

or

```js
pnpm dev:bootstrap
```

or

```js
pnpm dev:jquery
```

or

```js
pnpm dev:vanilla
```

To run **all** flavors from a single server — each example rendered by every flavor, with a top-level index at [http://localhost:8080/](http://localhost:8080/) linking the whole flavor × example matrix — use:

```js
pnpm dev:all
```

Because the flavors share a global rendering context (one flavor per page), each cell in the matrix loads exactly one flavor bundle under `/<flavor>/example<n>/`.

The vanilla example pages (under both `dev:vanilla` and `dev:all`) include a **"Basic vanilla CSS"** checkbox that links and toggles the opt-in stylesheet, so you can flip between the minimal styled output and the raw semantic HTML on browser default styles (e.g. to see the `lang` suffix on language-tagged values appear/disappear).

## Vanilla presentation flavor

`dist/rdforms.vanilla.js` is a **presentation-only** flavor that renders semantic HTML with **no JavaScript library (React/jQuery) and no CSS framework (Bootstrap)** — for better accessibility and easier integration into host platforms. It coexists with the other flavors (load exactly one per page).

- Groups → `<dl class="rdforms-group">`, labels → `<dt>`, values → `<dd>` (repeated values → repeated `<dd>`), nested groups → nested `<dl>`.
- Heading-styled groups → `<section>` + `<h2>`/`<h3>` (level tracks nesting depth); table-styled groups → a real `<table>` with `<caption>`, `<thead>`/`<th scope="col">` and `<tbody>`; language literals carry `lang`, dates render as `<time datetime>`, and URIs/choices as `<a href>`.
- All classes use the hyphenated **`rdforms-*`** namespace — a stable public integration surface, deliberately distinct from the other flavors' `rdforms*` camelCase classes so there is no overlap with Bootstrap.

```html
<script type="text/javascript" src="https://unpkg.com/@entryscape/rdforms/dist/rdforms.vanilla.js"></script>
<script type="module">
    new rdforms.VanillaPresenter({ graph, resource, template }, 'node_id');
</script>
```

The flavor also ships a `ValidationPresenter` (`new rdforms.ValidationPresenter({ graph, resource, template }, 'node_id')`) that renders the same semantic HTML with validation markers — an `error`/`warning`/`deprecated` class on the affected value and a `<p class="rdforms-validation …">` message (`role="alert"` for errors, `role="status"` for warnings and deprecations).

### Styling is opt-in

Unlike the other flavors (which inject their CSS/framework automatically), the vanilla bundle ships **no styles** — loading `rdforms.vanilla.js` emits plain semantic HTML that renders acceptably on the browser's default styles. For a minimal starting look, `<link>` the separately-shipped stylesheet, then override or replace it as needed:

```html
<link rel="stylesheet" href="https://unpkg.com/@entryscape/rdforms/dist/rdforms.vanilla.css" />
```

It is minimal and layout-only (namespaced under `rdforms-*`, so it can't leak into or clash with host styles) plus a small demonstration rule that surfaces the `lang` of language-tagged values. During development you can flip it on and off with the "Basic vanilla CSS" checkbox on the vanilla example pages (see below).

Editors are out of scope for this flavor (presentation only).

## Examples

The examples serve two purposes:

1. Showcase the capabilites of RDForms.
2. Provide good ground for development and testing.

### Running the examples

The example sources live in the `html/` directory — one folder per example (`example1` … `example8`), each with an `index.html` and an `init.js` that builds the graph, template and view. There are two ways to run them:

- **Dev server (live reload)** — `pnpm dev:<flavor>` (`react`, `bootstrap`, `jquery` or `vanilla`) starts webpack-dev-server, opens your browser, and serves each example at `http://localhost:8080/example<n>/`. The flavor you launch decides which bundle the examples load, so it's the quickest way to try a template against a specific flavor.
- **Built samples** — `pnpm build:samples` then `pnpm serve:samples` writes static copies under `samples/<flavor>/` and serves them at `http://localhost:8080/<flavor>/example<n>/` (the links below use this layout).

Note: the editor examples (e.g. example1) need an editor-capable flavor (`react` or `bootstrap`); the `jquery` and `vanilla` flavors are presentation-only, so editor examples fall back to a read-only presenter under them.

The examples are outlined below:

### [example1](http://localhost:8080/react/example1) - Editor for one field

1. Loads the library and its CSS.
2. Creates a minimal RDF graph manually.
3. Creates a minimal RDForms template manually.
4. Creates the editor UI from the RDF graph, a given resource, a template and an HTML node.

Check [example1/init.js](http://localhost:8080/react/example1/init.js) for more.

### [example2](http://localhost:8080/react/example2) - Editor for large template loaded from file

Different from example1 in the sense that it loads the graph and template from separate files.
Check [example2/init.js](http://localhost:8080/react/example2/init.js) for more.

### [example3](http://localhost:8080/react/example3) - Presenter

Same template and data as in example2, but now the presenter is used instead.
Check [example3/init.js](http://localhost:8080/react/example3/init.js) for more.

### [example4](http://localhost:8080/react/example4) - Validation presenter

This examples shows how RDForms can be used as a form validator rather than just an editor or presenter.
Take a look at the validation report inside the form presenter.

Check [example4/init.js](http://localhost:8080/react/example4/init.js) for more.

### [example5](http://localhost:8080/react/example5) - Building on default templates

This examples utilizes pre-made templates to render forms. It can serve as a very good start for extending them and creating your
own custom forms.

Check [example5/init.js](http://localhost:8080/react/example5/init.js) for more.

### [example6](http://localhost:8080/react/example6) - RDF output from editor (Template is for Dataset according to DCAT-AP)

This example provides a ready output to check your form RDF output live.

Check [example6/init.js](http://localhost:8080/react/example6/init.js) for more.

### [example7](http://localhost:8080/react/example7) - RDForm editor with a registered chooser

This is a more advanced example providing some guidance on how to create your own choosers and register them to show on
select fields in your forms. You can even have your data be fetched across the network.

Check [example7/init.js](http://localhost:8080/react/example7/init.js) for more.
