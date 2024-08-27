package com.GRS.backend.resolver;

import com.GRS.backend.annotations.QueryParams;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class QueryArgumentResolver implements HandlerMethodArgumentResolver {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(QueryParams.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        QueryParams annotation = parameter.getParameterAnnotation(QueryParams.class);

        String search = webRequest.getParameter("search") != null ? webRequest.getParameter("search") : annotation.search();
        String searchBy = webRequest.getParameter("search_by") != null ? webRequest.getParameter("search_by") : annotation.searchBy();
        int page = webRequest.getParameter("page") != null ? Integer.parseInt(webRequest.getParameter("page")) : annotation.page();
        int pageSize = webRequest.getParameter("page_size") != null ? Integer.parseInt(webRequest.getParameter("page_size")) : annotation.pageSize();
        String sortBy = webRequest.getParameter("sort_by") != null ? webRequest.getParameter("sort_by") : annotation.sortBy();
        String sortOrder = webRequest.getParameter("sort_order") != null ? webRequest.getParameter("sort_order") : annotation.sortOrder();
        String startDateStr = webRequest.getParameter("start_date") != null ? webRequest.getParameter("start_date") : annotation.startDate();
        String endDateStr = webRequest.getParameter("end_date") != null ? webRequest.getParameter("end_date") : annotation.endDate();

        int maxLength = 50;
        if (search.length() > maxLength || searchBy.length() > maxLength ||
                sortBy.length() > maxLength || sortOrder.length() > maxLength ||
                startDateStr.length() > maxLength || endDateStr.length() > maxLength) {
            throw new IllegalArgumentException("One or more query parameters exceed the maximum allowed length of " + maxLength + " characters.");
        }

        LocalDate startDate = LocalDate.parse(startDateStr, DATE_FORMATTER);
        LocalDate endDate = endDateStr.isEmpty() ? LocalDate.now() : LocalDate.parse(endDateStr, DATE_FORMATTER);

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        return new QueryParamsContainer(search, searchBy, startDate, endDate, pageable);

    }

    public static class QueryParamsContainer {
        private final String search;
        private final String searchBy;
        private final LocalDate startDate;
        private final LocalDate endDate;
        private final Pageable pageable;

        public QueryParamsContainer(String search, String searchBy, LocalDate startDate, LocalDate endDate, Pageable pageable) {
            this.search = search;
            this.searchBy = searchBy;
            this.startDate = startDate;
            this.endDate = endDate;
            this.pageable = pageable;
        }

        public String getSearch() {
            return search;
        }

        public String getSearchBy() {
            return searchBy;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public Pageable getPageable() {
            return pageable;
        }
    }
}


