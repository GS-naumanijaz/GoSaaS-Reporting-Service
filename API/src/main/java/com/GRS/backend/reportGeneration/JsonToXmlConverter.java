package com.GRS.backend.reportGeneration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@Component
public class JsonToXmlConverter {

    public String convertJsonToXml(InputStream jsonInputStream) {
        // Read the JSON string from the InputStream
        String json = new Scanner(jsonInputStream, StandardCharsets.UTF_8).useDelimiter("\\A").next();

        // Convert JSON string to Object
        ObjectMapper jsonMapper = new ObjectMapper();
        Object jsonObject;
        try {
            jsonObject = jsonMapper.readValue(json, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON", e);
        }

        // Convert Object to XML
        XmlMapper xmlMapper = new XmlMapper();
        String xml;
        try {
            xml = buildXml(jsonObject);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to XML", e);
        }

        System.out.println("Converted JSON to XML:");
        System.out.println(xml);
        return xml;
    }

    private String buildXml(Object jsonObject) throws Exception {
        StringBuilder xmlBuilder = new StringBuilder();

        if (jsonObject instanceof List) {
            xmlBuilder.append("<records>");
            List<?> jsonArray = (List<?>) jsonObject;
            for (Object obj : jsonArray) {
                if (obj instanceof Map) {
                    Map<?, ?> jsonMap = (Map<?, ?>) obj;
                    String recordXml = new XmlMapper().writeValueAsString(jsonMap);
                    xmlBuilder.append("<record>").append(recordXml.substring(recordXml.indexOf(">") + 1, recordXml.lastIndexOf("<"))).append("</record>");
                }
            }
            xmlBuilder.append("</records>");
        } else if (jsonObject instanceof Map) {
            xmlBuilder.append("<record>");
            xmlBuilder.append(new XmlMapper().writeValueAsString(jsonObject));
            xmlBuilder.append("</record>");
        } else {
            throw new Exception("Unsupported JSON structure");
        }

        return xmlBuilder.toString();
    }
}
