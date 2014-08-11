<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:html="http://www.w3.org/1999/xhtml"
                version="1.0">

<xsl:output method="xml" indent="yes" />

<xsl:template match="/">
<xsl:copy-of select="*"/>
</xsl:template>

</xsl:stylesheet>