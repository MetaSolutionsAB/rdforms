# RDForms

RDForms (aka RDF Forms) is a JavaScript library that uses templates to describe how to edit, present and validate RDF. The library is intended to be used in web applications to ease the burden of developers to deal natively with RDF.

RDForms is designed to be adaptable to different UI libraries. Currently, integrations are provided for the following three UI libraries:

- Bootstrap 4
- Bootstrap Material Design
- React and Material UI

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

## Development

You can develop the different UI libraries as well as the part of the generic code base by running the examples in the webpack-dev-server:

```js
pnpm dev:react
```

or

```js
pnpm dev:bootstrap
```

## Examples

The examples serve two purposes:

1. Showcase the capabilites of RDForms.
2. Provide good ground for development and testing.

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

Check [example7/init.js](http://localhost:8080/rect/example7/init.js) for more.
