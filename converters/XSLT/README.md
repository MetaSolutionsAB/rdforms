# XSLT utilities

The parser used for XML in nodejs is xmldom, unfortunately it does not handle internal ENTITY declarations.
One simple solution is to remove all ENTITY declarations using a simple XSLT identity transform.
On linux machines the xsltproc command can be used like:

    $ xsltproc identity.xslt infile.xml -o outfile.xml

Or use the shell script like:

    $ ./expandEntities infile.xml outfile.xml