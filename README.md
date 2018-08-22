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

## samples/example3.html

Different from example2 in how it loads the template form a separate file and how to depend on files not part of the build.
See the next section for a longer explanation about the build.

# A note on how to use the built version
The build process uses r.js and works like this:

1. All needed files are copied over to the release folder
2. Files are transpiled if needed (converting ES6 to ES5)
3. Depended files are bundled together into release/all.js and then removed as standalone files in the release folder

So you should be able to use rdforms by simply including the all.js. (see samples/example1.html).

However, if you need files that are not bundled in all.js there are two alternatives:

1. Change in config/deps.js to include the additional files you need.
2. Provide a suitable fallback to load missing files from the release folder

To achieve alternative 2 you add the following before you load any rdforms files via require.

    require.config({
        baseUrl: "../release"
    });

The path (baseUrl) need to be relative to your main html file. You can see an example of this in samples/example3.html.

Note: a baseUrl is already given in the config/deps.js which is also included in all.js. However, in most production environments this value is wrong as it points to the libs directory (not transpiled). In many cases it is also the wrong relative path from your html file.)