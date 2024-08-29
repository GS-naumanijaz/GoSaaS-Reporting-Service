package com.GRS.backend.oauth;

import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.utilities.AuditLogGenerator;
import com.GRS.backend.utilities.OAuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collections;
import java.util.Map;

@RestController
public class oauthController {

    @Autowired
    private UserService userService;

    @GetMapping("/checkAuth")
    public ResponseEntity<Map<String, Boolean>> checkAuth(HttpServletRequest request) {
        // get auth and check if still authenticated or not
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
        Map<String, Boolean> response = Collections.singletonMap("authenticated", isAuthenticated);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response, OAuth2AuthenticationToken authHeader) {
        // sets auth to null ie logged out and redirects to login page
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(authHeader));

        AuditLogGenerator.getInstance().log(AuditLogAction.LOGOUT, username);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/";
    }

    @GetMapping("/currentUser")
    public OAuth2User getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        return oauth2User;
    }

}