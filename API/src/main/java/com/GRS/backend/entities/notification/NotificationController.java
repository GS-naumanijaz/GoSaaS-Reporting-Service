package com.GRS.backend.entities.notification;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.notification.Notification;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.entities.request.RequestService;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RequestService requestService;

    @GetMapping
    public ResponseEntity<Object> getAllNotifications(@QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        Pageable pageable = paginationParams.getPageable();

        Page<Notification> allNotifications = notificationService.getAllNotifications(search, pageable);

        return Response.responseBuilder("Notifications retrieved successfully", HttpStatus.OK, allNotifications);
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<Object> getNotificationById(@PathVariable int notificationId) {
        Optional<Notification> notificationToAdd = notificationService.getNotificationById(notificationId);
        if (notificationToAdd.isPresent()) {
            return Response.responseBuilder("Notification found successfully", HttpStatus.OK, notificationToAdd);
        } else {
            return Response.responseBuilder("Failed to find notification", HttpStatus.OK, null);
        }
    }

    @PostMapping("/{requestId}")
    public ResponseEntity<Object> addNotification(@RequestBody Notification notification, @PathVariable int requestId) {
        Optional<Request> notificationApp = requestService.getRequestById(requestId);

//        notification.set(notificationApp.get());

        Notification createdNotification = notificationService.addNotification(notification);

        return Response.responseBuilder("Notification added successfully", HttpStatus.OK, createdNotification);
    }

    @PatchMapping("/{notificationId}")
    public ResponseEntity<Object> updateNotification(@RequestBody Notification notification, @PathVariable int notificationId) {
        Notification updatedNotification = notificationService.updateNotification(notificationId, notification);
        return Response.responseBuilder("Notification updated successfully", HttpStatus.OK, updatedNotification);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Object> deleteNotification(@PathVariable int notificationId) {
        notificationService.deleteNotification(notificationId);
        return Response.responseBuilder("Notification deleted successfully", HttpStatus.OK, null);
    }
    
}
