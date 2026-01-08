# Component Inventory

## UI Kit (`src/components/ui`)
Reusable atomic components implementing the design system.

- **`Badge`**: Status indicators and tags.
- **`Button`**: Primary and secondary actions.
- **`DialogSimple`**: Modal wrapper for forms and alerts.
- **`Input`**: Text input fields.
- **`Select`**: Dropdown selection menus.

## Layout (`src/components/layout`)
Structural components for the application shell.

- **`AppHeader`**: Top navigation bar containing the View Selector and Settings trigger.

## Calendar Domain (`src/components/calendar`)
Components responsible for the temporal grid visualization.

- **`CalendarGrid`**: Main grid renderer (standard implementation).
- **`CalendarGridVirtualized`**: Optimized grid renderer for large datasets (React Window).
- **`CalendarSelector`**: Toggles visibility of different calendar categories.
- **`CalendarForm`**: Creation/Edit form for Calendars.
- **`ViewSelector`**: Controls the current time granularity (Weeks, Months, Years).

## Events Domain (`src/components/events`)
Components for managing life events.

- **`EventCard`**: Preview card for a single event in list view.
- **`EventForm`**: Input form for creating and editing events.
- **`EventsList`**: List view of events for a selected date/period.

## Settings (`src/components/settings`)
Application configuration.

- **`SettingsDialog`**: Modal for configuring user profile (DOB) and app preferences.
