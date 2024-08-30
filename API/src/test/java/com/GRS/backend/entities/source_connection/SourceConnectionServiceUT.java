package com.GRS.backend.entities.source_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.models.StoredProcedure;
import com.GRS.backend.utilities.DatabaseUtilities;
import com.GRS.backend.utilities.FieldUpdater;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class SourceConnectionServiceUT {

    @Mock
    private SourceConnectionRepository sourceConnectionRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private SourceConnectionService sourceConnectionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Tests for getAllSourceConnections with search and searchBy
    @Test
    public void testGetAllSourceConnectionsWithSearch() {
        int appId = 1;
        String search = "test";
        String searchBy = "alias";
        Pageable pageable = Pageable.unpaged();

        Application application = new Application();
        application.setIsDeleted(false);
        when(applicationRepository.findById(appId)).thenReturn(Optional.of(application));

        // Mock the behavior of sourceConnectionRepository
        Page<SourceConnection> page = new PageImpl<>(new ArrayList<>()); // Mocked Page with empty list
        when(sourceConnectionRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        // Invoke the method under test
        Page<SourceConnection> result = sourceConnectionService.getAllSourceConnections(appId, search, searchBy, pageable);
        assertNotNull(result);

        // Capture the Specification passed to the repository
        ArgumentCaptor<Specification<SourceConnection>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(sourceConnectionRepository).findAll(specCaptor.capture(), any(Pageable.class));

        // Optional: Validate Specification if needed
        Specification<SourceConnection> capturedSpec = specCaptor.getValue();
        // Add checks on the capturedSpec if necessary (e.g., if it has the right conditions)
    }


    // Test for getSourceConnectionById
    @Test
    public void testGetSourceConnectionById() {
        int sourceConnectionId = 1;
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setId(sourceConnectionId);
        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.of(sourceConnection));

        SourceConnection result = sourceConnectionService.getSourceConnectionById(sourceConnectionId);

        assertNotNull(result);
        verify(sourceConnectionRepository).findById(sourceConnectionId);
    }

    @Test
    public void testGetSourceConnectionByIdNotFound() {
        int sourceConnectionId = 1;
        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            sourceConnectionService.getSourceConnectionById(sourceConnectionId);
        });

        assertEquals("Source Connection with ID " + sourceConnectionId + " not found", exception.getMessage());
    }

    // Test for addSourceConnection
    @Test
    public void testAddSourceConnection() {
        SourceConnection sourceConnection = new SourceConnection();
        String username = "user";
        when(sourceConnectionRepository.save(any(SourceConnection.class))).thenReturn(sourceConnection);

        SourceConnection result = sourceConnectionService.addSourceConnection(sourceConnection, username);

        assertNotNull(result);
        verify(sourceConnectionRepository).save(sourceConnection);
    }

    // Test for updateSourceConnection
    @Test
    public void testUpdateSourceConnection() {
        int sourceConnectionId = 1;
        SourceConnection existingSourceConnection = new SourceConnection();
        SourceConnection updatedSourceConnection = new SourceConnection();
        String username = "user";

        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.of(existingSourceConnection));
        when(sourceConnectionRepository.save(any(SourceConnection.class))).thenReturn(updatedSourceConnection);

        SourceConnection result = sourceConnectionService.updateSourceConnection(sourceConnectionId, updatedSourceConnection, username);

        assertNotNull(result);
        verify(sourceConnectionRepository).findById(sourceConnectionId);
        verify(sourceConnectionRepository).save(existingSourceConnection);
    }

    @Test
    public void testUpdateSourceConnectionNotFound() {
        int sourceConnectionId = 1;
        SourceConnection updatedSourceConnection = new SourceConnection();
        String username = "user";

        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            sourceConnectionService.updateSourceConnection(sourceConnectionId, updatedSourceConnection, username);
        });

        assertEquals("Source Connection with ID " + sourceConnectionId + " not found", exception.getMessage());
    }

    // Test for bulkUpdateIsActive
    @Test
    public void testBulkUpdateIsActive() {
        List<Integer> sourceConnectionIds = List.of(1, 2);
        boolean isActive = false;
        String username = "user";

        SourceConnection sourceConnection1 = new SourceConnection();
        SourceConnection sourceConnection2 = new SourceConnection();

        when(sourceConnectionRepository.findById(1)).thenReturn(Optional.of(sourceConnection1));
        when(sourceConnectionRepository.findById(2)).thenReturn(Optional.of(sourceConnection2));
        when(sourceConnectionRepository.save(any(SourceConnection.class))).thenReturn(sourceConnection1).thenReturn(sourceConnection2);

        List<SourceConnection> result = sourceConnectionService.bulkUpdateIsActive(sourceConnectionIds, isActive, username);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(sourceConnectionRepository, times(2)).findById(anyInt());
        verify(sourceConnectionRepository, times(2)).save(any(SourceConnection.class));
    }

    @Test
    void testDecryptPassword() {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setPassword("PlainTextPassword");
        sourceConnection.setKey("validBase64EncodedKey");

        // Assume encryptPassword sets a valid key and encryptedPassword
        sourceConnection.encryptPassword();

        // Test decryptPassword
        sourceConnection.decryptPassword();
        // Assert decrypted password
        assertEquals("PlainTextPassword", sourceConnection.getPassword());
    }


    // Test for deleteSourceConnection
    @Test
    public void testDeleteSourceConnection() {
        int sourceConnectionId = 1;
        SourceConnection existingSourceConnection = new SourceConnection();
        existingSourceConnection.setIsDeleted(false);

        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.of(existingSourceConnection));
        when(sourceConnectionRepository.save(any(SourceConnection.class))).thenReturn(existingSourceConnection);

        SourceConnection result = sourceConnectionService.deleteSourceConnection(sourceConnectionId, "user");

        assertNotNull(result);
        assertTrue(result.getIsDeleted());
        verify(sourceConnectionRepository).findById(sourceConnectionId);
        verify(sourceConnectionRepository).save(existingSourceConnection);
    }

    @Test
    public void testDeleteSourceConnectionNotFound() {
        int sourceConnectionId = 1;

        when(sourceConnectionRepository.findById(sourceConnectionId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            sourceConnectionService.deleteSourceConnection(sourceConnectionId, "user");
        });

        assertEquals("SourceConnection with ID " + sourceConnectionId + " not found", exception.getMessage());
    }

    // Test for bulkDeleteSourceConnections
    @Test
    public void testBulkDeleteSourceConnections() {
        List<Integer> sourceConnectionIds = List.of(1, 2);
        String username = "user";

        SourceConnection sourceConnection1 = new SourceConnection();
        SourceConnection sourceConnection2 = new SourceConnection();

        when(sourceConnectionRepository.findById(1)).thenReturn(Optional.of(sourceConnection1));
        when(sourceConnectionRepository.findById(2)).thenReturn(Optional.of(sourceConnection2));
        when(sourceConnectionRepository.save(any(SourceConnection.class))).thenReturn(sourceConnection1).thenReturn(sourceConnection2);

        List<String> result = sourceConnectionService.bulkDeleteSourceConnections(sourceConnectionIds, username);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(sourceConnectionRepository, times(2)).findById(anyInt());
        verify(sourceConnectionRepository, times(2)).save(any(SourceConnection.class));
    }

    // Test for getSourceConnectionStoredProcedures
//    @Test
//    public void testGetSourceConnectionStoredProcedures() {
//        SourceConnection sourceConnection = new SourceConnection();
//        List<StoredProcedure> storedProcedures = new ArrayList<>();
//        when(DatabaseUtilities.getDatabaseInfo(sourceConnection)).thenReturn(storedProcedures);
//
//        List<StoredProcedure> result = sourceConnectionService.getSourceConnectionStoredProcedures(sourceConnection);
//
//        assertNotNull(result);
//        assertEquals(storedProcedures, result);
//        verify(DatabaseUtilities).getDatabaseInfo(sourceConnection);
//    }
}
