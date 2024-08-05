package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/destination-connections")
public class DestinationConnectionController {

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @GetMapping
    public ResponseEntity<Object> getAllDestinationConnections(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "app_id") String sortBy,
            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        Page<DestinationConnection> allDestinationConnections = destinationConnectionService.getAllDestinationConnections(search, pageable);

        return Response.responseBuilder("Destination Connections retrieved successfully", HttpStatus.OK, allDestinationConnections);

    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<Object> getDestinationConnectionById(@PathVariable int destinationId) {
        Optional<DestinationConnection> connectionToAdd = destinationConnectionService.getDestinationConnectionById(destinationId);
        if (connectionToAdd.isPresent()) {
            return Response.responseBuilder("Destination Connection found successfully", HttpStatus.OK, connectionToAdd);
        } else {
            return Response.responseBuilder("Failed to find destination connection", HttpStatus.OK, null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addDestinationConnection(@RequestBody DestinationConnection destinationConnection) {
        DestinationConnection createdDestinationConnection = destinationConnectionService.addDestinationConnection(destinationConnection);
        return Response.responseBuilder("Destination Connection added successfully", HttpStatus.OK, createdDestinationConnection);
    }

    @PatchMapping("/{destinationId}")
    public ResponseEntity<Object> updateDestinationConnection(@RequestBody DestinationConnection destinationConnection, @PathVariable int destinationId) {
        DestinationConnection updatedDestinationConnection = destinationConnectionService.updateDestinationConnection(destinationId, destinationConnection);
        return Response.responseBuilder("Destination Connection updated successfully", HttpStatus.OK, updatedDestinationConnection);
    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Object> deleteDestinationConnection(@PathVariable int destinationId) {
        destinationConnectionService.deleteDestinationConnection(destinationId);
        return Response.responseBuilder("Destination Connection deleted successfully", HttpStatus.OK, null);
    }
    
}
