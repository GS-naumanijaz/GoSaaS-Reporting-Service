package com.GRS.backend.reportGeneration;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

@Component
public class JsonToXmlConverter {

    public String convertJsonToXml(InputStream jsonInputStream) {
        // Read the JSON string from the InputStream
        String json = new Scanner(jsonInputStream, StandardCharsets.UTF_8).useDelimiter("\\A").next();

        // Convert the string to a JSON array
        JSONArray jsonArray = null;
        try {
            jsonArray = new JSONArray(json);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        // Convert each object in the array to XML and wrap it in a root element
        StringBuilder xmlBuilder = new StringBuilder();
        xmlBuilder.append("<records>");
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = null;
            try {
                jsonObject = jsonArray.getJSONObject(i);
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
            String xml = XML.toString(jsonObject, "record");
            xmlBuilder.append(xml);
        }
        xmlBuilder.append("</records>");

        return xmlBuilder.toString();
    }
}
