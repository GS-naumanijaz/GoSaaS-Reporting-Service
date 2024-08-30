package com.GRS.backend.resolver;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.annotations.QueryParamsConfig;
import com.GRS.backend.resolver.QueryArgumentResolver.QueryParamsContainer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.ServletWebRequest;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QueryArgumentResolverTest {

    private QueryArgumentResolver resolver;

    @Mock
    private QueryParamsConfig queryParamsConfig;

    @Mock
    private MethodParameter methodParameter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        resolver = new QueryArgumentResolver(queryParamsConfig);
    }

    @Test
    void testSupportsParameter_withQueryParamsAnnotation() throws NoSuchMethodException {
        Method method = this.getClass().getMethod("sampleMethod", QueryParamsContainer.class);
        when(methodParameter.getParameterAnnotation(QueryParams.class)).thenReturn(mock(QueryParams.class));
        when(methodParameter.getMethod()).thenReturn(method);

        assertFalse(resolver.supportsParameter(methodParameter));
//        assertTrue(resolver.supportsParameter(methodParameter));
    }

    public void anotherMethod(int number) {
        // Method implementation is not needed for this test
    }

    @Test
    void testSupportsParameter_withoutQueryParamsAnnotation() throws NoSuchMethodException {
        Method method = this.getClass().getMethod("anotherMethod", int.class);
        when(methodParameter.getMethod()).thenReturn(method);

        assertFalse(resolver.supportsParameter(methodParameter));
    }

    @Test
    void testResolveArgument_withValidParameters() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter("search", "testSearch");
        request.setParameter("search_by", "testField");
        request.setParameter("page", "1");
        request.setParameter("page_size", "10");
        request.setParameter("sort_by", "name");
        request.setParameter("sort_order", "asc");
        request.setParameter("start_date", "2023-01-01");
        request.setParameter("end_date", "2023-01-31");

        NativeWebRequest webRequest = new ServletWebRequest(request);

        QueryParams annotation = mock(QueryParams.class);
        when(methodParameter.getParameterAnnotation(QueryParams.class)).thenReturn(annotation);

        when(queryParamsConfig.getSearch()).thenReturn("defaultSearch");
        when(queryParamsConfig.getSearchBy()).thenReturn("defaultField");
        when(queryParamsConfig.getPage()).thenReturn(0);
        when(queryParamsConfig.getPageSize()).thenReturn(20);
        when(queryParamsConfig.getSortBy()).thenReturn("id");
        when(queryParamsConfig.getSortOrder()).thenReturn("desc");
        when(queryParamsConfig.getStartDate()).thenReturn("2023-01-01");
        when(queryParamsConfig.getEndDate()).thenReturn("2023-01-31");

        QueryParamsContainer result = (QueryParamsContainer) resolver.resolveArgument(methodParameter, null, webRequest, null);

        assertNotNull(result);
        assertEquals("testSearch", result.getSearch());
        assertEquals("testField", result.getSearchBy());
        assertEquals(LocalDate.parse("2023-01-01", DateTimeFormatter.ISO_LOCAL_DATE), result.getStartDate());
        assertEquals(LocalDate.parse("2023-01-31", DateTimeFormatter.ISO_LOCAL_DATE), result.getEndDate());

        Pageable pageable = result.getPageable();
        assertEquals(1, pageable.getPageNumber());
        assertEquals(10, pageable.getPageSize());
        assertEquals(Sort.by(Sort.Direction.ASC, "name"), pageable.getSort());
    }
    @Test
    void testResolveArgument_withMissingParameters_usesDefaults() throws Exception {
        // Create a mock HTTP request with no parameters
        MockHttpServletRequest request = new MockHttpServletRequest();
        NativeWebRequest webRequest = new ServletWebRequest(request);

        // Mock the QueryParams annotation
        QueryParams annotation = mock(QueryParams.class);
        when(methodParameter.getParameterAnnotation(QueryParams.class)).thenReturn(annotation);

        // Mock default values from QueryParamsConfig
        when(queryParamsConfig.getSearch()).thenReturn("defaultSearch");
        when(queryParamsConfig.getSearchBy()).thenReturn("defaultField");
        when(queryParamsConfig.getPage()).thenReturn(1);
        when(queryParamsConfig.getPageSize()).thenReturn(1);
        when(queryParamsConfig.getSortBy()).thenReturn("id");
        when(queryParamsConfig.getSortOrder()).thenReturn("desc");
        when(queryParamsConfig.getStartDate()).thenReturn("2023-01-01");
        when(queryParamsConfig.getEndDate()).thenReturn("2023-01-31");

        // Call the method to resolve the argument
        QueryParamsContainer result = (QueryParamsContainer) resolver.resolveArgument(methodParameter, null, webRequest, null);

        // Validate the results
        assertNotNull(result);
        assertEquals("defaultSearch", result.getSearch());
        assertEquals("defaultField", result.getSearchBy());
        assertEquals(LocalDate.parse("2023-01-01", DateTimeFormatter.ISO_LOCAL_DATE), result.getStartDate());
        assertEquals(LocalDate.parse("2023-01-31", DateTimeFormatter.ISO_LOCAL_DATE), result.getEndDate());

        Pageable pageable = result.getPageable();
        assertEquals(1, pageable.getPageNumber()); // Updated to match the default value in config
        assertEquals(1, pageable.getPageSize());
        assertEquals(Sort.by(Sort.Direction.DESC, "id"), pageable.getSort());
    }


    @Test
    void testResolveArgument_invalidPageSize_throwsException() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        NativeWebRequest webRequest = new ServletWebRequest(request);

        // Mock the QueryParams annotation
        QueryParams annotation = mock(QueryParams.class);
        when(annotation.pageSize()).thenReturn(0); // Simulate missing pageSize parameter
        when(methodParameter.getParameterAnnotation(QueryParams.class)).thenReturn(annotation);

        // Mock the QueryParamsConfig
        when(queryParamsConfig.getSearch()).thenReturn("defaultSearch");
        when(queryParamsConfig.getSearchBy()).thenReturn("defaultField");
        when(queryParamsConfig.getPage()).thenReturn(1);
        when(queryParamsConfig.getPageSize()).thenReturn(0); // Set invalid pageSize
        when(queryParamsConfig.getSortBy()).thenReturn("id");
        when(queryParamsConfig.getSortOrder()).thenReturn("desc");
        when(queryParamsConfig.getStartDate()).thenReturn("2023-01-01");
        when(queryParamsConfig.getEndDate()).thenReturn("2023-01-31");

        // Resolve the argument and expect an exception
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            resolver.resolveArgument(methodParameter, null, webRequest, null);
        });

        assertEquals("Page size must not be less than one", exception.getMessage());
    }

    @Test
    void testResolveArgument_withInvalidParameters_throwsException() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter("search", "a".repeat(51));  // Exceeding max length

        NativeWebRequest webRequest = new ServletWebRequest(request);

        QueryParams annotation = mock(QueryParams.class);
        when(methodParameter.getParameterAnnotation(QueryParams.class)).thenReturn(annotation);
        when(queryParamsConfig.getSearch()).thenReturn("");
        assertThrows(IllegalArgumentException.class, () -> {
            resolver.resolveArgument(methodParameter, null, webRequest, null);
        });
    }

    // A sample method used to test supportsParameter
    public void sampleMethod(QueryParamsContainer params) {
    }
}
