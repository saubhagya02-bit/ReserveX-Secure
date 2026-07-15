# 📚 ReserveX - Book Fair Stall Booking System

**ReserveX** is a modern, full-stack web application designed to manage stall reservations for the Colombo International Book Fair. It provides a seamless, interactive experience for book vendors to select, reserve, and manage their stalls, while offering administrators a powerful dashboard to oversee the entire event.

> **Academic Context:** This project was developed as the group assignment for the **SENG 22212 – Software Architecture and Design** module at the University of Kelaniya.

## ✨ Key Features

* **Interactive Floor Plan:** A dynamic, grid-based live map allowing vendors to visually select available stalls.
* **Dual-Portal Architecture:** * **Online Portal:** For vendors to browse the map, book up to 3 stalls, and assign specific literary genres to their spaces.
    * **Admin Portal:** For event organizers to manage stall availability, view booking statistics via a live dashboard, and oversee vendor accounts.
* **Secure Authentication:** Role-based access control (Vendor vs. Admin/Employee) secured by JSON Web Tokens (JWT).
* **Automated Email Notifications:** Vendors receive instant confirmation emails with a QR code receipt upon successful reservation.
* **Real-time Analytics:** Visual dashboards utilizing pie charts and dynamic stats calculations.
## Project Modules

- `backend`: Spring Boot REST API with JWT authentication, role-based access, MySQL persistence, and email support.
- `online-portal`: Vendor-facing React app for authentication, stall browsing, reservations, and profile actions.
- `admin-portal`: Admin/employee React app for monitoring reservations and managing stalls.
- `database`: Data model reference (`db.sql`).

## Tech Stack

- **Backend**: Java 17, Spring Boot, Spring Security, Spring Data JPA, MySQL, Maven
- **Frontend**: React, Vite, Axios, React Router
- **Other**: JWT, SMTP email integration


## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ and npm
- MySQL

### 1) Run Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080` by default.

### 2) Run Online Portal

```bash
cd online-portal
npm install
npm run dev
```

### 3) Run Admin Portal

```bash
cd admin-portal
npm install
npm run dev
```

## Environment Notes

- Backend configuration is in `backend/src/main/resources/application.properties`.
- Online portal API base URL can be configured using:
  - `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`)

## API Overview (High-Level)

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Reservations: `/api/reservations/*`
- Stalls: `/api/stalls/*`
- Admin: `/api/admin/*`
- Genres: `/api/genres/*`
- Contact: `/api/contact`

## Academic Context

This codebase was developed collaboratively as a university coursework deliverable for:

**SENG 22212 - Software Architecture and Design**  
Group Assignment Project

