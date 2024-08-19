package com.GRS.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DestinationConnectionDTO {

    private int id;
    private String alias;

    public DestinationConnectionDTO(int id, String alias) {
        this.id = id;
        this.alias = alias;
    }
}
