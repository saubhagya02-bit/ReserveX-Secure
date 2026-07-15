# Database Analysis & Connecting Online Portal (No Frontend Changes)

This guide explains the ReserveX database and how to connect the **online portal** to the real backend/database **without changing the online portal's structure or methods**. All adaptations are done on the backend and configuration only.

---

## 1. Database Analysis

### 1.1 Schema Overview

| Table | Purpose |
|-------|--------|
| **users** | Vendors and employees: `user_id`, `business_name`, `email`, `username`, `password`, `no_of_current_bookings`, `created_at`. Roles: VENDOR, EMPLOYEE. |
| **stalls** | Bookable stalls: `stall_id`, `stall_name`, `size` (small/medium/large), `price`, `gridCol`, `gridRow`, `is_Confirmed`. |
| **reservations** | Booking header: `reservation_id`, `user_id`, `reservation_date`, `status` (Pending/Approved/Rejected), `qr_code_path`. |
| **reservation_stalls** | Many-to-many: which stalls are in each reservation. |
| **reservation_genres** | Genres per reservation: `reservation_id`, `genre_name` (and optionally `stall_id` in schema; entity uses reservation + genre only). |

### 1.2 Relationships

- **reservations** → **users** (many-to-one).
- **reservations** ↔ **stalls** (many-to-many via **reservation_stalls**).
- **reservation_genres** → **reservations** (many-to-one).

### 1.3 Connection Details (Backend)

- **URL:** `jdbc:mysql://localhost:3306/reservex?createDatabaseIfNotExist=true&...`
- **Database name:** `reservex`
- **JPA:** `spring.jpa.hibernate.ddl-auto=update` (schema created/updated by Hibernate).

Ensure MySQL is running and the `reservex` database exists (or let the app create it). Set `spring.datasource.username` and `spring.datasource.password` in `application.properties` to match your MySQL user.

---

## 2. What the Online Portal Expects (Keep Unchanged)

The online portal is built to work with these **endpoints and shapes**. The backend is adapted to match them.

### 2.1 Base URL

- Frontend uses: `VITE_API_BASE_URL` or `http://localhost:8080/api/v1`
- So all backend endpoints must live under **`/api/v1`** (e.g. `/api/v1/auth/login`, `/api/v1/stalls`).

### 2.2 Auth

| Action | Frontend sends | Frontend expects (no change) |
|--------|----------------|------------------------------|
| **Login** | `POST /auth/login` with `{ email, password }` | `{ user: { user_id, username, business_name, email, roles, no_of_current_bookings }, token }` |
| **Register** | `POST /auth/register` with `{ BuissnesName, username, email, password, confirmPassword }` | Success response (e.g. 201); message optional. |

- Login uses **email** (not `username` in body). Backend accepts `email` and uses it as the username for authentication.
- `roles` is a string (e.g. `"VENDOR"`). Login page checks `response.user?.roles?.toUpperCase() !== "VENDOR"` for access.

### 2.3 Stalls

| Action | Frontend | Expected response shape |
|--------|----------|---------------------------|
| **Get all** | `GET /stalls` | Array of stalls. Each stall: `id` or `stall_id`, `size` (e.g. "Large"/"Medium"/"Small"), `gridRow`, `gridCol`, `isConfirmed`, `price`, optional `name`/`description`. |

- Frontend uses `s?.id ?? s?.stall_id` when sending stall IDs for reservation.

### 2.4 Reservations

| Action | Frontend | Expected |
|--------|----------|----------|
| **Create** | `POST /reservations` with `{ stall_ids: [id1, id2, ...] }` | Success response (e.g. 201). |
| **My reservations** | `GET /reservations/my` | Array of reservation objects. |

- Backend must accept **`stall_ids`** (snake_case) so the frontend does not need to change.

### 2.5 Genres

| Action | Frontend | Expected |
|--------|----------|----------|
| **Get all** | `GET /genres` | List of genre names (or array). |
| **Add** | `POST /genres` with `{ genreName }` | Success. |
| **Set all** | `PUT /genres` with array of strings | Success. |

---

## 3. What Was Done on the Backend (So You Don’t Change the Portal)

1. **Base path**  
   - Set `server.servlet.context-path=/api/v1` and mapped controllers under `/auth`, `/stalls`, `/reservations`, `/genres` so full paths are `/api/v1/auth`, etc.

2. **Auth**  
   - Login accepts `email` (and optionally `username`) in the request body.  
   - Login response returns `{ user: { user_id, username, business_name, email, roles, no_of_current_bookings }, token }` so the portal’s existing `login(response.user, response.token)` and role check work unchanged.

3. **Register**  
   - Register endpoint accepts `BuissnesName` / `business_name` / `businessName` for business name so the current register form works without changes.

4. **Stalls**  
   - Stall API returns objects with `id`, `name`, `size` (capitalized: Small/Medium/Large), `gridRow`, `gridCol`, `isConfirmed`, `price`, and `reserved` so the stall map and reservation flow work as-is.

5. **Reservations**  
   - Create-reservation endpoint accepts **`stall_ids`** (snake_case) in the request body in addition to `stallIds`.

6. **ReservationDto / Repository / Email**  
   - Reservation entity uses `qrCodePath` and `reservationDate`; DTO and repository/email code were aligned to use these (e.g. `getQrCodePath()`, order by `reservationDate`). User entity has no `contactPerson`; email uses a safe fallback.

---

## 4. What You Do in the Online Portal (Config Only, No Structure or Method Changes)

1. **Point the app at the backend**  
   - In the online portal, set env so the API base URL is the backend:
     - Either in `.env`:  
       `VITE_API_BASE_URL=http://localhost:8080/api/v1`
     - Or keep default in code: `http://localhost:8080/api/v1` (already correct if backend runs on 8080 with context path `/api/v1`).

2. **Use the real API instead of mocks**  
   - In `auth.service.js`: set `USE_MOCK = false`.  
   - In `stall.service.js`: set `USE_MOCK_DATA = false`.  
   - In `reservation.service.js`: set `USE_MOCK = false`.  

No changes to component structure, hooks, or method signatures are required; only these flags and the base URL.

---

## 5. Quick Checklist

- [ ] MySQL running; `reservex` database and credentials in `application.properties`.
- [ ] Backend starts on port 8080 with context path `/api/v1`.
- [ ] Online portal: `VITE_API_BASE_URL=http://localhost:8080/api/v1` (or leave default).
- [ ] Online portal: `USE_MOCK` / `USE_MOCK_DATA` set to `false` in auth, stall, and reservation services.
- [ ] Test: Register → Login → View stalls → Create reservation → View “my reservations”.

---

## 6. Optional: CORS

If the portal runs on a different origin (e.g. `http://localhost:5173`), ensure the backend allows that origin in CORS. Spring Boot can expose a `WebMvcConfigurer` that adds the portal origin to allowed origins for `/api/v1/**`.
