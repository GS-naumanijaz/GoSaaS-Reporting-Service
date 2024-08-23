package com.GRS.backend.reportGeneration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/api")
public class JsonToPDFController {

    @Autowired
    private JsonToXmlConverter jsonToXmlConverter;

    @Autowired
    private XmlToHtmlTransformer xmlToHtmlTransformer;

    @Autowired
    private HtmlToPdfConverter htmlToPdfConverter;

    @GetMapping("/pdf")
    public ResponseEntity<String> generatePdf() {
        try {
            // Load the JSON file from resources
            ClassPathResource jsonResource = new ClassPathResource("input.json");
            InputStream jsonInputStream = jsonResource.getInputStream();

            // Convert JSON to XML
            String xml = jsonToXmlConverter.convertJsonToXml(jsonInputStream);

            // Load the XSL file from resources
            ClassPathResource xslResource = new ClassPathResource("transform.xsl");
            InputStream xslInputStream = xslResource.getInputStream();

            // Transform the XML to HTML using the XSL file
            String html = xmlToHtmlTransformer.transformXmlToHtml(xml, xslInputStream);

            String reportName = "report " + LocalDateTime.now() + ".pdf";

            // Convert the HTML to PDF and upload to S3
            htmlToPdfConverter.convertHtmlToPdfAndUpload(html, reportName);

            // Return a success message
            return ResponseEntity.ok("PDF successfully generated and uploaded to S3.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }
}
