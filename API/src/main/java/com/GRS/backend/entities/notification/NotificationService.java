package com.GRS.backend.entities.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;

    public Page<Notification> getAllNotifications(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            //implement search heree
        }
        return notificationRepository.findAll(pageable);
    }

    public Optional<Notification> getNotificationById(int notificationId) {
        return notificationRepository.findById(notificationId);
    }

    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(int notificationId, Notification notification) {
        Optional<Notification> existingNotification = notificationRepository.findById(notificationId);
        if (existingNotification.isPresent()) {
            
            //update here
        }
        return null;
    }

    public void deleteNotification(int notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
}
