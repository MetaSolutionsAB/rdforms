# RDForms

RDForms ("RDF Forms") is a JavaScript library that provides a way to declarative describe how editors and presentation
views of RDF should look like. The configuration mechanism eliminates the need for programming once the library has
been deployed into an environment.

RDForms was previously known as SHAME.

# Preliminaries

Before you can use RDForms you need to make sure all the dependencies are loaded. Simply run:

    $ cd path_to_rdforms
    $ npm   install
    $ bower install

This requires that you have [nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed
as well as [bower](http://bower.io/). Note: npm installs nodejs libraries used by converters and a small webserver
used by the formulator (to be introduced below) while bower installs the client libraries such as dojo and rdfjson
that RDForms builds upon.

If you want to run any of the built versions, i.e. versions that load RForms as a single minified file, you need to build
RDForms first, this is done by:

    $ cd path_to_rdforms/build
    $ ./build.sh

Note: You have to either access RDForms via a web server (the http uri scheme rather than the file uri scheme) or
follow the development instructions below for running the samples.

# Development

It is recommended to experiment directly with non-built versions as it gives you very good debugging and inspection tools
to understand what is going on (especially firebug in firefox and the built in debugging tools in Chrome).
Furthermore, you do not have to deploy the rdforms library on a web server, you can point your browser to the
sample directory using file: address, for instance file:///path_to_rdforms/samples/editorView.html.
But due to the AJAX approach for loading dependencies you first have to allow your browser to do ajax request from a file url,
in Firefox this is done by:

1. Going into the config mode by typing about:config in the location bar
2. Searching for and changing the security.fileuri.strict_origin_policy to false

In Chrome this is done by starting the browser with the following flag: --allow-file-access-from-files

# Authoring RDForms templates in a UI

It is perfectly feasible to construct the RDForms templates by hand in a text editor of some sort. But for the beginner it is
recommended to use the ***Formulator*** tool. First we need to start a small web-server:

    $ cd path_to_rdforms/bin
    $ ./server.sh

Note that by default it will start the server on port 8181, so make sure that it is not already in use.
Otherwise you have to change the server.js file. Now when the simple web server is running you can point your browser
to the ```templates``` directory at [http://localhost:8181/templates/](http://localhost:8181/templates/).

You will see a listing of all the RDForms template bundles in that directory. If you click on one of them the Formulator will
launch that allows you to test the template bundle functionality. Note that if there is an accompanying file ending with .rdf
it will be loaded and matched RDF expressions will show up in the editor/presentor UI (only triples originating from the
resource *http://example.com/about* though).

The Formulator also allows you to change the RDForms template bundle and if you press the save button it will update the template bundle
on disk. Note that Formulator takes three arguments:

Argument | Value | Comment
---------|-------|--------
templates | a comma-separated list of template bundles | each template bundle must be specified relatively the formulator.html file.
deps | a comma-separated list of template bundles | these template bundles will be read-only, but can be referenced
saveDisabled | true or false, false is assumed if this argument is not provided | indicates whether the save button should be enabled or not

For example: ```http://localhost:8181/rdforms/apps/formulator?templates=../templates/test.json&deps=../templates/dcterms.json```

To help you experiment without destroying the existing established RDForms templates there is a another directory called
```local_templates``` accessible at
[http://localhost:8181/local_templates/](http://localhost:8181/local_templates/)
It is recommended to copy the ```templates/dc.json``` and ```templates/dc.rdf``` to ```local_templates``` for experimenting purposes.
Everything in ```local_templates``` will be ignored by the versioning system (git).

# Generating RDForms templates

In addition to constructing the RDForms templates manually it is also possible to generate them from different sources.
Currently both RDFS and DSP is supported, they are located in the ```converters``` directory. At this point in time
they are not well documented, hence, the best approach is to mimic how they have been used in the ```common``` directory.

In general the workflow have been:

1. Find a useful source material for the vocabulary
2. Select a converter, currently RDFS, DSP or write a custom converter (as is the case with the schema.org vocabulary)
3. Adapt or provide the configuration for the converter, iterate until the maximum capability of the converter is reached.
4. Copy the result to the templates or local_templates directory and do some manual editing with Formulator.

The benefit of using a convertor is that you avoid a lot of copy pasting, and in the future when the converters have been
sufficiently advanced the manual step with Formulator may be reduced even further. This would allow you to be in better
sync with the vocabulary source.