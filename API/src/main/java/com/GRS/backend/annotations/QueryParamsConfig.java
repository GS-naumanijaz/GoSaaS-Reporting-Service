package com.GRS.backend.annotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class QueryParamsConfig {

    @Value("${queryparams.search.default:}")
    private String search = "";

    @Value("${queryparams.searchBy.default:id}")
    private String searchBy = "";

    @Value("${queryparams.page.default:0}")
    private int page = 1;

    @Value("${queryparams.pageSize.default:10}")
    private int pageSize = 1;

    @Value("${queryparams.sortBy.default:updatedAt}")
    private String sortBy;

    @Value("${queryparams.sortOrder.default:desc}")
    private String sortOrder;

    @Value("${queryparams.startDate.default:0000-01-01}")
    private String startDate;

    @Value("${queryparams.endDate.default:}")
    private String endDate;

    // Getters for each field

    public String getSearch() {
        return search;
    }

    public String getSearchBy() {
        return searchBy;
    }

    public int getPage() {
        return page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public String getSortBy() {
        return sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }
}
