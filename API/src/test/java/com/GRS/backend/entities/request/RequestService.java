package com.GRS.backend.entities.request;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.enums.RequestStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class RequestServiceTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private RequestService requestService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllRequests() {
        // Setup mock behavior
        Request request = new Request();
        request.setDestination_connection(new DestinationConnection()); // Ensure it's not null
        when(requestRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(request)));

        // Execute the method
        Page<Request> result = requestService.getAllRequests("search", "application", PageRequest.of(0, 10), LocalDate.now().minusDays(7), LocalDate.now());

        // Verify the result
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(requestRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetAllRequestsWhenDestinationConnectionIsNull() {
        // Setup mock behavior with a request having null destination_connection
        Request request = new Request();
        request.setDestination_connection(null); // Set to null to simulate the condition
        when(requestRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(request)));

        // Execute the method
        Page<Request> result = requestService.getAllRequests("search", "application", PageRequest.of(0, 10), LocalDate.now().minusDays(7), LocalDate.now());

        // Verify the result
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(requestRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }


    @Test
    void testGetStatusCounts() {
        // Setup mock behavior
        Request inProgressRequest = new Request();
        inProgressRequest.setStatus(RequestStatus.valueOf("inprogress"));
        Request completedRequest = new Request();
        completedRequest.setStatus(RequestStatus.valueOf("successful"));
        Request failedRequest = new Request();
        failedRequest.setStatus(RequestStatus.valueOf("failed"));

        when(requestRepository.findAll()).thenReturn(Arrays.asList(inProgressRequest, completedRequest, failedRequest));

        // Execute the method
        Map<String, Integer> result = requestService.getStatusCounts();

        // Verify the result
        assertEquals(1, result.get("inprogress"));
        assertEquals(1, result.get("completed"));
        assertEquals(1, result.get("failed"));
    }

    @Test
    void testGetRequestById() {
        // Setup mock behavior
        Request request = new Request();
        when(requestRepository.findById(anyInt())).thenReturn(Optional.of(request));

        // Execute the method
        Request result = requestService.getRequestById(1);

        // Verify the result
        assertNotNull(result);
        verify(requestRepository, times(1)).findById(anyInt());
    }

    @Test
    void testGetRequestByIdNotFound() {
        // Setup mock behavior
        when(requestRepository.findById(anyInt())).thenReturn(Optional.empty());

        // Execute the method and verify exception
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            requestService.getRequestById(1);
        });

        assertEquals("Request with ID 1 not found", exception.getMessage());
    }

    @Test
    void testAddRequest() {
        // Setup mock behavior
        Application application = new Application();
        application.setIsDeleted(false);
        Request request = new Request();
        request.setApplication(application);

        when(applicationRepository.findById(anyInt())).thenReturn(Optional.of(application));
        when(requestRepository.save(any(Request.class))).thenReturn(request);

        // Execute the method
        Request result = requestService.addRequest(request);

        // Verify the result
        assertNotNull(result);
        assertEquals(application, result.getApplication());
        verify(requestRepository, times(1)).save(any(Request.class));
    }

    @Test
    void testUpdateRequest() {
        // Setup mock behavior
        Request existingRequest = new Request();
        existingRequest.setId(1);
        existingRequest.setParams(new String[]{"oldParam1", "oldParam2"}); // Correctly set as String[]
        when(requestRepository.findById(anyInt())).thenReturn(Optional.of(existingRequest));
        when(requestRepository.save(any(Request.class))).thenReturn(existingRequest);

        Request updatedRequest = new Request();
        updatedRequest.setId(1);
        updatedRequest.setParams(new String[]{"newParam1", "newParam2"}); // Set as String[]
        updatedRequest.setReportName("newReportName");

        // Execute the method
        Request result = requestService.updateRequest(updatedRequest);

        // Verify the result
        assertNotNull(result);
        assertArrayEquals(new String[]{"newParam1", "newParam2"}, result.getParams());
        assertEquals("newReportName", result.getReportName());
        verify(requestRepository, times(1)).findById(anyInt());
        verify(requestRepository, times(1)).save(any(Request.class));
    }

    @Test
    void testUpdateRequestById() {
        // Setup mock behavior
        Request existingRequest = new Request();
        existingRequest.setId(1);
        existingRequest.setParams(new String[]{"oldParam1", "oldParam2"}); // Correctly set as String[]
        when(requestRepository.findById(anyInt())).thenReturn(Optional.of(existingRequest));
        when(requestRepository.save(any(Request.class))).thenReturn(existingRequest);

        Request updatedRequest = new Request();
        updatedRequest.setParams(new String[]{"newParam1", "newParam2"}); // Set as String[]

        // Execute the method
        Request result = requestService.updateRequest(1, updatedRequest);

        // Verify the result
        assertNotNull(result);
        assertArrayEquals(new String[]{"newParam1", "newParam2"}, result.getParams());
        verify(requestRepository, times(1)).findById(anyInt());
        verify(requestRepository, times(1)).save(any(Request.class));
    }

    @Test
    void testSaveOrUpdateRequest() {
        // Setup mock behavior
        Request request = new Request();
        when(requestRepository.save(any(Request.class))).thenReturn(request);

        // Execute the method
        Request result = requestService.saveOrUpdateRequest(request);

        // Verify the result
        assertNotNull(result);
        verify(requestRepository, times(1)).save(any(Request.class));
    }
}
