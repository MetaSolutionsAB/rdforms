# RDForms

RDForms ("RDF Forms") is a JavaScript library that provides a way to declarative describe how editors and presentation
views of RDF should look like. The configuration mechanism eliminates the need for programming once the library has
been deployed into an environment.

# Preliminaries

Before you can use RDForms you need to make sure all the dependencies are loaded:

    $ cd path_to_rdforms
    $ yarn
    $ yarn build

This requires that you have [nodejs](http://nodejs.org/), [npm](https://www.npmjs.org/) and [yarn](https://yarnpkg.com/) already available in your system.

# Development

It is recommended to experiment with the development version as it gives you very good debugging and inspection tools
to understand what is going on (especially firebug in firefox and the built in debugging tools in Chrome).
Furthermore, you do not have to deploy the rdforms library on a web server, you can point your browser to the
sample directory using file: address, for instance file:///path_to_rdforms/samples/example1.html.

# Samples

A good way to start is to take a look at the samples. To be able to run the samples smoothly you can use the webpack 
dev server to spin up a local http server which will *watch* your code changes and re-bundle automatically. 

```
cd path_to_rdforms
yarn dev
```

Now you can access your sample in your browsers at [http://localhost:8080/samples/](http://localhost:8080/samples/). 
For all the following examples their respective `.js` files control which are the data and how the forms are rendered.  

## [example1.html](http://localhost:8080/samples/example1.html) - Simple Editor

1. Loads the library and its CSS.
2. Creates a minimal RDF graph manually.
3. Creates a minimal RDForms template manually.
4. Creates the editor UI from the RDF graph, a given resource, a template and an HTML node.

Check [example1.js](http://localhost:8080/samples/example1.js) for more.

## [example2.html](http://localhost:8080/samples/example2.html) - Editor in Bootstrap

Different from example1 in the sense that it loads the graph and template from separate files.

Check [example2.js](http://localhost:8080/samples/example2.js) for more.

## [example2-bmd.html](http://localhost:8080/samples/example2-bmd.html) - Editor using Material design

Same as example 2 but with a material design theme for bootstrap.

Check [example2.js](http://localhost:8080/samples/example2.js) for more.

## [example3.html](http://localhost:8080/samples/example3.html) - Presenter using material design

Different from example2 in how it loads the template form a separate file and how to depend on files not part of the build.
See the next section for a longer explanation about the build.

Check [example3.js](http://localhost:8080/samples/example3.js) for more.

## [example4.html](http://localhost:8080/samples/example4.html) - Validation presenter using material design

This examples shows how RDForms can be used as a form validator rather than just an editor. 
Take a look at the validation report  inside the form presenter.

Check [example4.js](http://localhost:8080/samples/example4.js) for more.

## [example5.html](http://localhost:8080/samples/example5.html) - Building on default templates

This examples utilizes pre-made templates to render forms. It can serve as a very good start for extending them and creating your
own custom forms.

Check [example5.js](http://localhost:8080/samples/example5.js) for more.

## [example6.html](http://localhost:8080/samples/example6.html) - RDF output from editor (Template is for Dataset according to DCAT-AP)

This example provides a ready output to check your form RDF output live.

Check [example6.js](http://localhost:8080/samples/example6.js) for more.

## [example7.html](http://localhost:8080/samples/example7.html) - RDForm editor with a registered chooser

This is a more advanced example providing some guidance on how to create your own choosers and register them to show on 
select fields in your forms. You can even have your data be fetched across the network.

Check [example7.js](http://localhost:8080/samples/example7.js) for more.


# A note on how to use the built version
The build process uses webpack and outputs the bundled result into the dist folder. The result is babelified into JavaScript ES5
and you should be able to use the library by simply including the dist/rdforms.js. Check the examples above for more info on 
the library's API or feel free to explore the `src/` directory.
