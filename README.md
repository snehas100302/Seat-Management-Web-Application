# Seat Management App

A web-based admission management system for configuring programs and quotas, managing applicants, allocating seats with quota enforcement, confirming admissions with admission numbers, and tracking documents/fees. Built with Spring Boot (Java 21, PostgreSQL) and React (Vite + TypeScript).

## Requirements (scope from brief)
- Configure institution, campus, department, program, academic year, course type (UG/PG), entry type (Regular/Lateral), admission mode (Government/Management).
- Seat matrix per program with quota-wise counters (KCET, COMEDK, Management) and optional Supernumerary; global J&K cap; block allocation when quota is full; prevent overbooking.
- Applicant management with basic profile, category, entry type, quota type, marks, document checklist (Pending/Submitted/Verified).
- Allocation flows: Government (with external allotment number) and Management; seat lock only if quota has capacity.
- Admission confirmation only when fee is Paid; generate unique immutable admission number (e.g., INST/2026/UG/CSE/KCET/0001).
- Dashboards for intake vs admitted, quota-wise fill, remaining seats, pending documents/fees.

## Architecture
- **Backend**: Spring Boot 4, Java 21, PostgreSQL, Spring Security + JWT, JPA/Hibernate, Actuator, Springdoc OpenAPI.
- **Frontend**: React 18, TypeScript, Vite, React Router, lucide-react icons.
- **Ports**: API on `8085` (see `application.yml`); Vite dev server defaults to `5173`.

## Project structure
- `Seat Management App/` — Spring Boot service (API, security, JPA entities, services, allocation logic, seed data).
- `React/` — Vite + React SPA (dashboards, applicant/seat management screens, profile, allocation flows).

## Backend setup
1) Prerequisites: Java 21+, Maven Wrapper, PostgreSQL running locally.
2) Database: create a database (default `seat_mgmt_db`) and update credentials in `src/main/resources/application.yml` if needed. Current defaults use user `postgres` / password `29587674`.
3) Install & run:
   - `cd "Seat Management App"`
   - `./mvnw clean install`
   - `./mvnw spring-boot:run`
4) Swagger/OpenAPI: http://localhost:8085/swagger-ui/index.html
5) Health: http://localhost:8085/actuator/health
6) Seeded users (from `DataInitializer`):
   - Admin: `admin` / `admin123`
   - Admission Officer: `officer@institution.edu` / `officer123`

## Frontend setup
1) Prerequisites: Node 18+.
2) Install & run:
   - `cd React`
   - `npm install`
   - `npm run dev`
3) API base URL: set `VITE_API_BASE_URL` in a `.env` file (defaults to `http://localhost:8085`).

## Implemented features (high level)
- Master data: institutions, campuses, departments, programs, academic years, course/entry types, admission modes.
- Seat matrix with quota counters (KCET, COMEDK, Management, J&K, Supernumerary) and validation to prevent over-allocation; real-time remaining seats.
- Applicant management: creation/edit, category, entry type, quota selection, document status tracking, fee status.
- Allocation flows:
  - Government: capture external allotment number with KCET/COMEDK prefixes; validate quota availability; lock seat.
  - Management: direct allocation respecting quota counts.
- Admission confirmation gated by fee status; admission number generation; immutable once issued.
- Dashboards: intake vs admitted, quota-wise filled, remaining seats, pending documents/fees.
- Profile: view/update user profile for logged-in user.

## Configuration notes
- `spring.jpa.hibernate.ddl-auto=update` is enabled for rapid iteration; adjust for production and manage migrations explicitly.
- Logging writes under `${user.dir}/logs` (see `app.logging.dir`).
- Virtual threads enabled (`spring.threads.virtual.enabled=true`).

## Testing
- Backend uses Spring Boot test starters; no dedicated test suite authored yet.
- Frontend linting via `npm run lint` (ESLint + TypeScript rules).

## Quick history (recent changes)
- Added external allotment number input for government allocations with quota-specific prefixes.
- Expanded quota handling to include J&K and Supernumerary across API, UI, and seat matrix visuals.
- Fixed allocation NPEs by aligning program and admission mode resolution.
- Added profile APIs/UI and refreshed layout navigation.
- Build verified via `./mvnw clean install -DskipTests` (warnings only from Lombok processors).

## Deployment tips
- Externalize DB credentials and JWT secrets via environment variables or profile-specific `application-*.yml` files.
- For production, set `spring.profiles.active=prod`, disable dev tooling, and serve the built React app from a static host or behind the API gateway.
