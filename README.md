# RDForms

RDForms ("RDF Forms") is a JavaScript library that provides a way to declarative describe how editors and presentation
views of RDF should look like. The configuration mechanism eliminates the need for programming once the library has
been deployed into an environment.

# Preliminaries

Before you can use RDForms you need to make sure all the dependencies are loaded:

    $ cd path_to_rdforms
    $ git submodule init
    $ git submodule update
    $ npm   install
    $ grunt build

This requires that you have [nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/).

# Development

It is recommended to experiment directly with non-built versions as it gives you very good debugging and inspection tools
to understand what is going on (especially firebug in firefox and the built in debugging tools in Chrome).
Furthermore, you do not have to deploy the rdforms library on a web server, you can point your browser to the
sample directory using file: address, for instance file:///path_to_rdforms/samples/example1.html.
But due to the AJAX approach for loading dependencies you first have to allow your browser to do ajax request from a file url,
in Firefox this is done by:

1. Going into the config mode by typing about:config in the location bar
2. Searching for and changing the security.fileuri.strict_origin_policy to false

In Chrome this is done by starting the browser with the following flag: --allow-file-access-from-files

# Samples

A good way to start is to take a look at the samples.

## samples/example1.html

1. Loads the library and its CSS.
2. Creates a minimal RDF graph manually.
3. Creates a minimal RDForms template manually.
4. Creates the editor UI from the RDF graph, a given resource, a template and an HTML node.

## samples/example1-dev.html - Development version

Similar to example1.html but loads the RDForms framework in non-built version. This is useful for debugging. Take inspiration from this approach if you need to test new code and want to avoid the delay of the building process.

## samples/example2.html

Different from example1 in the sense that it loads the graph and template from separate files.
