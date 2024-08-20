package com.GRS.backend.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoredProcedure {

    private String name;
    private String[] parameters;

    public StoredProcedure(String name, String parameters) {
        this.name = name;
        this.parameters = parameters.split("\\s*,\\s*");
    }


}
