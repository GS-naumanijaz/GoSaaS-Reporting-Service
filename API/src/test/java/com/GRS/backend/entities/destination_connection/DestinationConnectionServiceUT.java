package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.DestinationConnectionDTO;
import com.GRS.backend.utilities.FieldUpdater;
import com.GRS.backend.utilities.S3BucketTester;
import org.junit.jupiter.api.Test;
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

public class DestinationConnectionServiceUT {

    @Mock
    private DestinationConnectionRepository destinationConnectionRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private DestinationConnectionService destinationConnectionService;

    public DestinationConnectionServiceUT() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDestinationConnections_Found() {
        // Arrange
        int appId = 1;
        Application application = new Application();
        application.setIsDeleted(false);

        DestinationConnection connection = new DestinationConnection();
        connection.setId(1);
        connection.setAlias("Alias");

        when(applicationRepository.findById(appId)).thenReturn(Optional.of(application));
        when(destinationConnectionRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl(List.of(connection)));

        // Act
        Page<DestinationConnection> result = destinationConnectionService.getAllDestinationConnections(appId, null, null, Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(destinationConnectionRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetAllDestinationConnections_ApplicationNotFound() {
        // Arrange
        int appId = 1;
        when(applicationRepository.findById(appId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class,
                () -> destinationConnectionService.getAllDestinationConnections(appId, null, null, Pageable.unpaged()));
    }

    @Test
    void testGetDestinationConnectionById_Found() {
        // Arrange
        int id = 1;
        DestinationConnection connection = new DestinationConnection();
        connection.setId(id);
        connection.setSecretKey("secret");

        when(destinationConnectionRepository.findById(id)).thenReturn(Optional.of(connection));

        // Act
        DestinationConnection result = destinationConnectionService.getDestinationConnectionById(id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(destinationConnectionRepository).findById(id);
    }

    @Test
    void testGetDestinationConnectionById_NotFound() {
        // Arrange
        int id = 1;
        when(destinationConnectionRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class,
                () -> destinationConnectionService.getDestinationConnectionById(id));
    }

    @Test
    void testAddDestinationConnection() {
        // Arrange
        DestinationConnection connection = new DestinationConnection();
        connection.setId(1);
        when(destinationConnectionRepository.save(any(DestinationConnection.class))).thenReturn(connection);

        // Act
        DestinationConnection result = destinationConnectionService.addDestinationConnection(connection, "username");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(destinationConnectionRepository).save(any(DestinationConnection.class));
    }

    @Test
    void testUpdateDestinationConnection() {
        // Arrange
        int id = 1;
        DestinationConnection existingConnection = new DestinationConnection();
        existingConnection.setId(id);
        existingConnection.setAlias("OldAlias");

        DestinationConnection updateConnection = new DestinationConnection();
        updateConnection.setAlias("NewAlias");

        when(destinationConnectionRepository.findById(id)).thenReturn(Optional.of(existingConnection));
        when(destinationConnectionRepository.save(any(DestinationConnection.class))).thenReturn(existingConnection);

        // Act
        DestinationConnection result = destinationConnectionService.updateDestinationConnection(id, updateConnection, "username");

        // Assert
        assertNotNull(result);
        assertEquals("NewAlias", result.getAlias());
        verify(destinationConnectionRepository).findById(id);
        verify(destinationConnectionRepository).save(any(DestinationConnection.class));
    }

    @Test
    void testDeleteDestinationConnection() {
        // Arrange
        int id = 1;
        DestinationConnection connection = new DestinationConnection();
        connection.setId(id);
        connection.setIsDeleted(false);

        when(destinationConnectionRepository.findById(id)).thenReturn(Optional.of(connection));
        when(destinationConnectionRepository.save(any(DestinationConnection.class))).thenReturn(connection);

        // Act
        DestinationConnection result = destinationConnectionService.deleteDestinationConnection(id, "username");

        // Assert
        assertNotNull(result);
        assertTrue(result.getIsDeleted());
        verify(destinationConnectionRepository).findById(id);
        verify(destinationConnectionRepository).save(any(DestinationConnection.class));
    }

    @Test
    void testBulkUpdateIsActive() {
        // Arrange
        List<Integer> ids = List.of(1, 2);
        DestinationConnection connection1 = new DestinationConnection();
        connection1.setId(1);
        connection1.setIsActive(true);
        DestinationConnection connection2 = new DestinationConnection();
        connection2.setId(2);
        connection2.setIsActive(true);

        when(destinationConnectionRepository.findById(1)).thenReturn(Optional.of(connection1));
        when(destinationConnectionRepository.findById(2)).thenReturn(Optional.of(connection2));
        when(destinationConnectionRepository.save(any(DestinationConnection.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<DestinationConnection> result = destinationConnectionService.bulkUpdateIsActive(ids, false, "username");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertFalse(result.get(0).getIsActive());
        assertFalse(result.get(1).getIsActive());
        verify(destinationConnectionRepository, times(2)).findById(anyInt());
        verify(destinationConnectionRepository, times(2)).save(any(DestinationConnection.class));
    }

    @Test
    void testBulkDeleteDestinationConnections() {
        // Arrange
        List<Integer> ids = List.of(1, 2);
        DestinationConnection connection1 = new DestinationConnection();
        connection1.setId(1);
        connection1.setIsDeleted(false);
        connection1.setAlias("Alias1");
        DestinationConnection connection2 = new DestinationConnection();
        connection2.setId(2);
        connection2.setIsDeleted(false);
        connection2.setAlias("Alias2");

        when(destinationConnectionRepository.findById(1)).thenReturn(Optional.of(connection1));
        when(destinationConnectionRepository.findById(2)).thenReturn(Optional.of(connection2));
        when(destinationConnectionRepository.save(any(DestinationConnection.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<String> deletedIds = destinationConnectionService.bulkDeleteDestinationConnections(ids, "username");

        // Assert
        assertNotNull(deletedIds);
        assertEquals(2, deletedIds.size());
        assertTrue(deletedIds.contains("Alias1"));
        assertTrue(deletedIds.contains("Alias2"));
        verify(destinationConnectionRepository, times(2)).findById(anyInt());
        verify(destinationConnectionRepository, times(2)).save(any(DestinationConnection.class));
    }
}
