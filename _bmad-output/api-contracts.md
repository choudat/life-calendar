# API Contracts

*(Note: This project is currently a client-side monolith. No backend API endpoints exist yet. This document covers client-side data interfaces that will likely become API contracts in Phase 3.)*

## Client-Side Interfaces

### `GET /calendars` (Local State)
Retrieves all user calendars.
- **Returns**: `CalendarCategory[]`

### `GET /events` (Local State)
Retrieves all events.
- **Returns**: `LifeEvent[]`

### Future API Design
(Planned for Phase 3 - Backend Integration)

#### `GET /api/v1/calendars`
- **Auth**: Required
- **Response**: JSON array of calendar objects.

#### `POST /api/v1/events`
- **Body**:
  ```json
  {
    "calendarId": "uuid",
    "title": "String",
    "startDate": "ISO-8601",
    "endDate": "ISO-8601 (optional)"
  }
  ```
