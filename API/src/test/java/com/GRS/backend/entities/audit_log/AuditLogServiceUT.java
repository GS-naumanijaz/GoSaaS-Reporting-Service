package com.GRS.backend.entities.audit_log;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.GRS.backend.base_models.BaseSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class AuditLogServiceUT{

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogService auditLogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllAuditLogs_WithSearchAndDateFilters() {
        // Arrange
        AuditLog auditLog = new AuditLog(); // Set fields if needed
        Page<AuditLog> page = new PageImpl<>(List.of(auditLog));
        when(auditLogRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        // Act
        Page<AuditLog> result = auditLogService.getAllAuditLogs("searchTerm", "searchBy", Pageable.unpaged(), LocalDate.now().minusDays(1), LocalDate.now());

        // Assert
        verify(auditLogRepository).findAll(any(Specification.class), any(Pageable.class));
        assert(result.getContent().size() == 1);
    }

    @Test
    void testGetAuditLogById_Found() {
        // Arrange
        AuditLog auditLog = new AuditLog();
        when(auditLogRepository.findById(anyInt())).thenReturn(Optional.of(auditLog));

        // Act
        Optional<AuditLog> result = auditLogService.getAuditLogById(1);

        // Assert
        assert(result.isPresent());
        assert(result.get().equals(auditLog));
    }

    @Test
    void testGetAuditLogById_NotFound() {
        // Arrange
        when(auditLogRepository.findById(anyInt())).thenReturn(Optional.empty());

        // Act
        Optional<AuditLog> result = auditLogService.getAuditLogById(1);

        // Assert
        assert(result.isEmpty());
    }

    @Test
    void testAddAuditLog() {
        // Arrange
        AuditLog auditLog = new AuditLog();
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(auditLog);

        // Act
        AuditLog result = auditLogService.addAuditLog(auditLog);

        // Assert
        verify(auditLogRepository).save(auditLog);
        assert(result.equals(auditLog));
    }

    @Test
    void testUpdateAuditLog_Found() {
        // Arrange
        AuditLog existingAuditLog = new AuditLog();
        existingAuditLog.setId(1); // Set an ID or any other fields if needed
        AuditLog updatedAuditLog = new AuditLog();
        updatedAuditLog.setId(1); // Ensure the ID is set to match the existing one
        // You might need to set additional fields here if needed

        when(auditLogRepository.findById(anyInt())).thenReturn(Optional.of(existingAuditLog));
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(updatedAuditLog);

        // Act
        AuditLog result = auditLogService.updateAuditLog(1, updatedAuditLog);

        // Assert
        verify(auditLogRepository).findById(1);
        verify(auditLogRepository).save(argThat(auditLog ->
                        auditLog.getId() == 1 // Ensure the ID matches
                // Add additional checks for other fields if necessary
        ));
        assert(result.equals(updatedAuditLog));
    }

    @Test
    void testUpdateAuditLog_NotFound() {
        // Arrange
        AuditLog updatedAuditLog = new AuditLog(); // Set fields if needed
        when(auditLogRepository.findById(anyInt())).thenReturn(Optional.empty());

        // Act
        AuditLog result = auditLogService.updateAuditLog(1, updatedAuditLog);

        // Assert
        assert(result == null);
    }

    @Test
    void testDeleteAuditLog() {
        // Act
        auditLogService.deleteAuditLog(1);

        // Assert
        verify(auditLogRepository).deleteById(1);
    }
}
