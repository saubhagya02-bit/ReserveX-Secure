# ReserveX - Secure Stall Reservation Platform

A stall reservation system for the Colombo International Book Fair, built as
part of Assessment 2: Secure Web Application Development. It consists of one
Spring Boot backend and two separate React frontends - a **Vendor Portal**
and an **Admin (Organizer) Portal** - both authenticated via OpenID Connect
through WSO2's Identity Platform (Asgardeo).

## Architecture

```
                        ┌────────────────────────┐
                        │   WSO2 Identity Platform │
                        │  (Asgardeo, OIDC + PKCE) │
                        └────────────┬────────────┘
                                     │ Access token (roles: Vendor / Organizer)
              ┌──────────────────────┼──────────────────────┐
              ▼                                              ▼
   ┌─────────────────────┐                      ┌─────────────────────┐
   │   Vendor Portal      │                      │   Admin Portal       │
   │ localhost:5173        │                      │ localhost:5174        │
   │ (Vendor role only)    │                      │ (Organizer role only) │
   └──────────┬───────────┘                      └──────────┬───────────┘
              │              Bearer token on every request              │
              └───────────────────────────┬───────────────────────────┘
                                           ▼
                        ┌──────────────────────────────┐
                        │  Spring Boot Backend            │
                        │  https://localhost:8443          │
                        │  (validates JWT against WSO2 JWKS)│
                        └──────────────────────────────────┘
```

Both portals use the **same** WSO2 application registration (one Client ID),
distinguished only by which redirect URL they came from and which role the
signed-in user holds. The backend is a single OAuth2 resource server that
authorizes every request based on the `roles` claim in the token - it does
not know or care which portal a request came from.

## Security Features (OWASP Top 10 mapping)

| Area | What's implemented |
|---|---|
| Broken Access Control | Frontend gates protected routes on a **verified role from the backend**, not just "signed in" (`ProtectedRoute.jsx` in both portals checks `user.role`, not only `isAuthenticated`). Backend enforces the same rule independently via `hasRole(...)` on every admin/vendor endpoint - the frontend check is UX only, never the actual security boundary. |
| Cryptographic Failures | HTTPS on the backend (self-signed cert for local dev). No passwords stored for OIDC users (`OIDC_USER` placeholder - auth is delegated entirely to WSO2). BCrypt for any legacy local accounts. |
| Injection | All queries go through Spring Data JPA repositories - no raw/concatenated SQL anywhere. |
| Identification & Authentication Failures | JWTs are validated for real: signature against WSO2's live JWKS endpoint, expiry/not-before timestamps, and JWT type header (`at+jwt` per RFC 9068). Rate limiting on the login-adjacent endpoints via `RateLimitFilter`. |
| Security Misconfiguration | All secrets (DB credentials, JWK Set URI, admin seed password) come from environment variables / `application.properties` placeholders - nothing hardcoded in source. Debug/verbose logging is off by default. |
| Security Logging & Monitoring | `AuditService` logs authentication and admin-action events server-side. |
| XSS | React's default output escaping, plus a `Content-Security-Policy` header restricting script/style/connect sources. |
| CSRF | Not applicable in the traditional sense - the API is fully stateless (no cookies/sessions; every request is authorized by an explicit Bearer token the browser must attach). |

## Prerequisites

- Java 17+ (backend built/tested on Java 21)
- Node 18+
- MySQL 8+ (or a hosted instance - the reference deployment used Aiven for
  MySQL)
- A WSO2 Identity Platform / Asgardeo account (free tier at
  console.asgardeo.io)

## 1. Database

```sql
CREATE DATABASE reservex;
```

Run `db.sql` (included in this repo) to create the schema, or let Hibernate
auto-create it on first run via `spring.jpa.hibernate.ddl-auto=update`.

## 2. WSO2 / Asgardeo Application Setup

1. Sign in to the console at your organization's Identity Platform URL.
2. **Applications → New Application → Single Page Application**, name it
   `ReserveX`.
3. **Protocol** tab:
   - Allowed grant types: **Code** + **Refresh Token** only.
   - Authorized redirect URLs - add **both**:
     `http://localhost:5173` and `http://localhost:5174`
   - Allowed origins - add both of the same two URLs.
   - PKCE: **Mandatory**, checked.
   - Client Authentication: **Public client**, checked (no client secret -
     this is a browser app).
   - Access Token: Token type **JWT**. Under **Access Token Attributes**,
     add `roles` explicitly - requesting the `roles` *scope* alone is not
     enough; the claim must be added here or it will never appear in the
     issued token.
4. **User Attributes** tab: confirm `email` and `roles`/`groups` are enabled
   to be included in tokens (a separate toggle from step 3 — both need to be
   on).
5. **Roles** tab: create two roles named exactly `Vendor` and `Organizer`
   (this exact casing - the backend's `hasRole(...)` checks are
   case-sensitive).
6. **Users** tab: create your test accounts and assign one role to each.
7. Copy the **Client ID** and your org's base URL (Info/Quick Start tab) -
   you'll need both in the next steps. Copy them directly rather than
   retyping to avoid transcription errors (e.g. `l` vs `I`).

## 3. Backend Configuration

Copy `application-example.properties` to `application.properties`:

```properties
# Database
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/reservex}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

# HTTPS
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${SSL_PASSWORD:changeit}
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=reservex
server.port=8443

# WSO2 / Asgardeo — validates access tokens issued to EITHER portal
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://api.asgardeo.io/t/YOUR_ORG/oauth2/jwks

# Legacy local admin seed account (optional — see "Legacy Auth" note below)
app.seed.admin-email=${ADMIN_EMAIL:admin@bookfair.lk}
app.seed.admin-username=${ADMIN_USERNAME:admin}
app.seed.admin-password=${ADMIN_PASSWORD:}
```

Generate the HTTPS keystore for local dev:

```bash
keytool -genkeypair -alias reservex -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore src/main/resources/keystore.p12 \
  -validity 3650 -storepass changeit
```

Run the backend:

```bash
mvn spring-boot:run
```

Runs on `https://localhost:8443`.

## 4. Vendor Portal

```bash
cd vendor-portal
npm install
```

`src/authConfig.js`:

```js
export const authConfig = {
  signInRedirectURL: "http://localhost:5173",
  signOutRedirectURL: "http://localhost:5173",
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG",
  scope: ["openid", "profile", "email", "roles"],
  storage: "sessionStorage",
  resourceServerURLs: ["https://localhost:8443"],
  disableTrySignInSilently: true,
  enableOIDCSessionManagement: false,
};
```

```bash
npm run dev
```

Runs on `http://localhost:5173`. Enforces **Vendor** role only - an
Organizer account signing in here is rejected and returned to the homepage.

## 5. Admin (Organizer) Portal

```bash
cd admin-portal
npm install
```

Same `authConfig.js` shape, with `signInRedirectURL`/`signOutRedirectURL`
set to `http://localhost:5174`.

```bash
npm run dev
```

Runs on `http://localhost:5174`. Enforces **Organizer** role only - a Vendor
account signing in here is rejected and kept on the Login screen; the
Dashboard is never navigated to at all.

## Test Accounts

| Role | Example email | Portal |
|---|---|---|
| Vendor | vendor@test.com | Vendor Portal (5173) |
| Organizer | organizer@test.com | Admin Portal (5174) |
