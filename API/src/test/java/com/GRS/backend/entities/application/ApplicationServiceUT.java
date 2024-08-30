package com.GRS.backend.entities.application;

import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.MockedStatic;
import static org.mockito.Mockito.*;

public class ApplicationServiceUT {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllApplications() {
        // Arrange
        List<Application> apps = new ArrayList<>();
        apps.add(new Application());
        Page<Application> page = new PageImpl<>(apps);

        when(applicationRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        // Act
        Page<Application> result = applicationService.getAllApplications("search", "searchBy", Pageable.unpaged(), "status", LocalDate.now(), LocalDate.now());

        // Assert
        assertEquals(1, result.getTotalElements());
        verify(applicationRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetApplicationById_ExistingId() {
        // Arrange
        Application app = new Application();
        when(applicationRepository.findById(1)).thenReturn(Optional.of(app));

        // Act
        Application result = applicationService.getApplicationById(1);

        // Assert
        assertEquals(app, result);
        verify(applicationRepository, times(1)).findById(1);
    }

    @Test
    void testGetApplicationById_NonExistingId() {
        // Arrange
        when(applicationRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> applicationService.getApplicationById(1));
    }

    @Test
    void testGetApplicationByAlias_ExistingAlias() {
        // Arrange
        Application app = new Application();
        when(applicationRepository.findByAlias("alias")).thenReturn(Optional.of(app));

        // Act
        Application result = applicationService.getApplicationByAlias("alias");

        // Assert
        assertEquals(app, result);
        verify(applicationRepository, times(1)).findByAlias("alias");
    }

    @Test
    void testGetApplicationByAlias_NonExistingAlias() {
        // Arrange
        when(applicationRepository.findByAlias("alias")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> applicationService.getApplicationByAlias("alias"));
    }

    @Test
    void testAddApplication() {
        // Arrange
        Application app = new Application();
        when(applicationRepository.save(app)).thenReturn(app);

        // Act
        Application result = applicationService.addApplication(app, "user");

        // Assert
        assertEquals(app, result);
        verify(applicationRepository, times(1)).save(app);
    }

    @Test
    void testUpdateApplication_ExistingId() {
        // Arrange
        Application existingApp = new Application();
        Application newApp = new Application();
        when(applicationRepository.findById(1)).thenReturn(Optional.of(existingApp));
        when(applicationRepository.save(existingApp)).thenReturn(existingApp);

        // Act & Assert
        try (MockedStatic<FieldUpdater> mockedFieldUpdater = mockStatic(FieldUpdater.class)) {
            applicationService.updateApplication(1, newApp, "user");

            // Verify that static method updateField was called three times
            mockedFieldUpdater.verify(() -> FieldUpdater.updateField(any(), eq("alias"), eq(newApp)), times(1));
            mockedFieldUpdater.verify(() -> FieldUpdater.updateField(any(), eq("description"), eq(newApp)), times(1));
            mockedFieldUpdater.verify(() -> FieldUpdater.updateField(any(), eq("isActive"), eq(newApp)), times(1));
        }

        // Verify interactions with repository
        verify(applicationRepository, times(1)).findById(1);
        verify(applicationRepository, times(1)).save(existingApp);
    }

    @Test
    void testUpdateApplication_NonExistingId() {
        // Arrange
        when(applicationRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> applicationService.updateApplication(1, new Application(), "user"));
    }

    @Test
    void testBulkUpdateIsActive() {
        // Arrange
        List<Application> apps = new ArrayList<>();
        Application app1 = new Application();
        Application app2 = new Application();
        apps.add(app1);
        apps.add(app2);

        when(applicationRepository.findById(1)).thenReturn(Optional.of(app1));
        when(applicationRepository.findById(2)).thenReturn(Optional.of(app2));
        when(applicationRepository.save(any(Application.class))).thenReturn(app1).thenReturn(app2);

        List<Integer> ids = List.of(1, 2);

        // Act
        List<Application> result = applicationService.bulkUpdateIsActive(ids, true, "user");

        // Assert
        assertEquals(2, result.size());
        verify(applicationRepository, times(2)).findById(anyInt());
        verify(applicationRepository, times(2)).save(any(Application.class));
    }

    @Test
    void testDeleteApplication_ExistingIdNotDeleted() {
        // Arrange
        Application app = new Application();
        app.setIsDeleted(false);
        when(applicationRepository.findById(1)).thenReturn(Optional.of(app));

        // Act
        Application result = applicationService.deleteApplication(1, "user");

        // Assert
        assertEquals(app, result);
        verify(applicationRepository, times(1)).findById(1);
        verify(applicationRepository, times(1)).save(app);
    }

    @Test
    void testDeleteApplication_ExistingIdAlreadyDeleted() {
        // Arrange
        Application app = new Application();
        app.setIsDeleted(true);
        when(applicationRepository.findById(1)).thenReturn(Optional.of(app));

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> applicationService.deleteApplication(1, "user"));
    }

    @Test
    void testDeleteApplication_NonExistingId() {
        // Arrange
        when(applicationRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> applicationService.deleteApplication(1, "user"));
    }

    @Test
    void testBulkDeleteApplications() {
        // Arrange
        Application app1 = new Application();
        Application app2 = new Application();
        app1.setIsDeleted(false);
        app2.setIsDeleted(false);

        when(applicationRepository.findById(1)).thenReturn(Optional.of(app1));
        when(applicationRepository.findById(2)).thenReturn(Optional.of(app2));
        when(applicationRepository.save(any(Application.class))).thenReturn(app1).thenReturn(app2);

        List<Integer> ids = List.of(1, 2);

        // Act
        List<String> result = applicationService.bulkDeleteApplications(ids, "user");

        // Assert
        assertEquals(2, result.size());
        verify(applicationRepository, times(2)).findById(anyInt());
        verify(applicationRepository, times(2)).save(any(Application.class));
    }
}
