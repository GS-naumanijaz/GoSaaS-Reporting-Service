package com.GRS.backend.reportGeneration;

import org.springframework.stereotype.Component;

import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;

@Component
public class XmlToHtmlTransformer {

    public String transformXmlToHtml(String xmlContent, InputStream xslInputStream) throws TransformerException {
        // Create a TransformerFactory
        TransformerFactory factory = TransformerFactory.newInstance();

        // Load the XSL file
        StreamSource xslStreamSource = new StreamSource(xslInputStream);

        // Create a Transformer with the XSL
        Transformer transformer = factory.newTransformer(xslStreamSource);

        // Set up the input and output streams
        StreamSource xmlStreamSource = new StreamSource(new StringReader(xmlContent));
        StringWriter htmlWriter = new StringWriter();
        StreamResult htmlStreamResult = new StreamResult(htmlWriter);

        // Perform the transformation
        transformer.transform(xmlStreamSource, htmlStreamResult);

        // Return the resulting HTML
        String html = htmlWriter.toString();

        // Remove the unwanted <META> tag using string manipulation
        html = html.replaceFirst("<META http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">", "");

        return html;
    }
}