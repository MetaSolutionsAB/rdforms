# RForms

RForms ("RDF Forms") is a JavaScript library that provides a way to declarative describe how editors and presentation
views of RDF should look like. The configuration mechanism eliminates the need for programming once the library has
been deployed into an environment. The RDF/JSON format is supported natively in the client.

RForms was previously known as SHAME.

# Installation

Before you can run any of the samples you have to make sure you have downloaded and build Dojo. Simply run:

    lib/INSTALL-dojo.sh

If you want to run any of the built versions, i.e. versions that load RForms as a single minified file, you need to build RForms first, this is done by:

    build/build.sh

Note: You have to either access RForms via a web server or follow the development instructions below for running the samples.
To clarify even further, accessing "file:///path_to_rforms_trunk/samples/some_example.html" is not possible unless of course
you have followed the instructions under development.
The reason is simply that the framework that RForms relies on loads files via XHR requests, which is not allowed by default over file:///.

# Development

It is recommended to experiment directly with non-built versions as it gives you very good debugging and inspection tools
to understand what is going on (especially firebug in firefox and the built in debugging tools in Chrome).
Furthermore, you do not have to deploy the rforms library on a web server, you can point your browser to the
sample directory using file: address, for instance file:///path_to_rforms_trunk/samples/editorView.html.
But due to the AJAX approach for loading dependencies you first have to allow your browser to do ajax request from a file url,
in Firefox this is done by:

1. Going into the config mode by typing about:config in the location bar
2. Searching for and changing the security.fileuri.strict_origin_policy to false

In Chrome this is done by starting the browser with the following flag: --allow-file-access-from-files

# Constructing RForms templates

It is perfectly feasible to construct the RForms templates by hand in a text editor of some sort. But for the beginner it is
recommended to use the ***Formulator*** tool. First you have to make sure that you have node and npm (node package manager)
installed on your system. Second we will start a very simple web server with help of node, but before we can do that you
need to install the node-static library which is used to serve static files, this is done by:

    $ cd bin
    $ npm install node-static

Now it is time to start the server:

    $ ./server.sh

Note that by default it will start the server on port 8181, so make sure that it is not already in use.
Otherwise you have to change the server.js file. Now when the simple web server is running you can point your browser
to the *templates* directory at [http://localhost:8181/templates/](http://localhost:8181/templates/).

You will see a listing of all the RForms templates in that directory. If you click on one of them the Formulator will
launch that allows you to test the template functionality. Note that if there is an accompanying file ending with .rdf
it will be loaded and matched RDF expressions will show up in the editor/presentor UI (only triples originating from the
resource *http://example.com/about*).

The Formulator also allows you to change the RForms template
and if you press the save button it will update the template on disk.

To help you experiment without destroying the existing established RForms templates there is a another directory called
*local_templates* accessible at
[http://localhost:8181/local_templates/](http://localhost:8181/local_templates/)
It is recommended to copy the *templates/dc.json* and *templates/dc.rdf* to *local_templates* for experimenting purposes.
Everything in *local_templates* will be ignored by the versioning system (git).

# Generating RForms templates

In addition to constructing the RForms templates manually it is also possible to generate them from different sources.
Currently both RDFS and DSP is supported, they are located in the *src/rforms/converters* directory. At this point in time
they are not well documented, hence, the best approach is to mimic how they have been used in the *src/rforms/common* directory.

In general the workflow have been:

1. Find a useful source material for the vocabulary
2. Select a converter, currently RDFS, DSP or write a custom converter (as is the case with the schema.org vocabulary)
3. Adapt or provide the configuration for the converter, iterate until the maximum capability of the converter is reached.
4. Copy the result to the templates or local_templates directory and do some manual editing with Formulator.

The benefit of using a convertor is that you avoid a lot of copy pasting, and in the future when the converters have been
sufficiently advanced the manual step with Formulator may be reduced even further. This would allow you to be in better
sync with the vocabulary source.