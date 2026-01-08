# Data Models

## Core Entities

### `CalendarCategory`
Represents a user-defined calendar for organizing events (e.g., "Health", "Career").
| TypeScript Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID). |
| `title` | `string` | Display name. |
| `icon` | `string` (optional) | Lucide icon name. |
| `color` | `string` | Hex color code for visualization. |
| `isVisible` | `boolean` | Toggles visibility on the grid. |

### `LifeEvent`
Represents a point in time or a duration on the calendar.
| TypeScript Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID). |
| `calendarId` | `string` | Foreign key to `CalendarCategory`. |
| `title` | `string` | Event title. |
| `startDate` | `Date` | Start of the event. |
| `endDate` | `Date` (optional) | End date. If present, defines a continuous period. |
| `isRecurring` | `boolean` | Flag for recurring events. |
| `recurrenceType` | `'monthly' \| 'yearly'` | Frequency of recurrence. |

### `ViewMode`
Type definition for the different visualization granularity.
- `'weeks'`: 52 columns/row (1 year).
- `'months'`: 12 columns/row (1 year).
- `'years'`: 10 columns/row (10 years).
- `'days-10'`, `'days-100'`, `'days-1000'`: Abstract day blocks.

## Relationships
- **One-to-Many**: One `CalendarCategory` can have multiple `LifeEvent`s.
- **Filtering**: State logic filters `LifeEvent`s based on `CalendarCategory.isVisible`.
