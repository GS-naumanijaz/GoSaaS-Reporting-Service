package com.GRS.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SourceConnectionDTO {
    private int id;
    private String alias;

    public SourceConnectionDTO(int id, String alias) {
        this.id = id;
        this.alias = alias;
    }
}
