package com.GRS.backend.resolver;

import com.GRS.backend.annotations.PaginationParams;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class PaginationArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(PaginationParams.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        PaginationParams annotation = parameter.getParameterAnnotation(PaginationParams.class);

        String search = webRequest.getParameter("search") != null ? webRequest.getParameter("search") : annotation.search();
        int page = webRequest.getParameter("page") != null ? Integer.parseInt(webRequest.getParameter("page")) : annotation.page();
        int pageSize = webRequest.getParameter("page_size") != null ? Integer.parseInt(webRequest.getParameter("page_size")) : annotation.pageSize();
        String sortBy = webRequest.getParameter("sortBy") != null ? webRequest.getParameter("sortBy") : annotation.sortBy();
        String sortOrder = webRequest.getParameter("sort_order") != null ? webRequest.getParameter("sort_order") : annotation.sortOrder();

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        return new PaginationParamsContainer(search, pageable);
    }

    public static class PaginationParamsContainer {
        private final String search;
        private final Pageable pageable;

        public PaginationParamsContainer(String search, Pageable pageable) {
            this.search = search;
            this.pageable = pageable;
        }

        public String getSearch() {
            return search;
        }

        public Pageable getPageable() {
            return pageable;
        }
    }
}

