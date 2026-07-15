// A “custom user object” Spring Security stores inside the session/security context
// Lets you access principal.getId() and user details easily in controllers

package com.reservex.backend.config;

import com.reservex.backend.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class UserPrincipal implements UserDetails {

    private final Integer id;
    private final String email;
    private final String password;
    private final String role;
    private final String username;
    private final String businessName;
    private final Integer noOfCurrentBookings;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole().name();
        this.username = user.getUsername();
        this.businessName = user.getBusinessName();
        this.noOfCurrentBookings = user.getNoOfCurrentBookings();
        this.authorities = List.of(user.getRole().name()).stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
