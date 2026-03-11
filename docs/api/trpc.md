# tRPC API Reference

Complete reference for Snap-It's tRPC API endpoints.

## Overview

The backend exposes a tRPC API at `/trpc`. All endpoints are type-safe and validated with Zod.

### Base URL

| Environment | URL                               |
| ----------- | --------------------------------- |
| Development | `http://localhost:9000/trpc`      |
| Production  | `https://api.yourdomain.com/trpc` |

### Authentication

| Procedure Type    | Auth Required      |
| ----------------- | ------------------ |
| `publicProcedure` | No                 |
| `adminProcedure`  | Yes (admin cookie) |

## Routers

```
appRouter
└── analytics
    ├── logEvent      (public)
    ├── getStats      (admin)
    └── getRecentEvents (admin)
```

---

## Analytics Router

### `analytics.logEvent`

Log an analytics event from the web app. Fire-and-forget — no response data needed.

**Authentication:** None (public)

**Input:**

| Field | Type   | Required | Description                       |
| ----- | ------ | -------- | --------------------------------- |
| type  | enum   | Yes      | Event type (see below)            |
| tool  | string | No       | Tool name for `tool_used` events  |
| meta  | string | No       | Additional metadata (JSON string) |

**Event Types:**

| Type                    | When to log                         |
| ----------------------- | ----------------------------------- |
| `image_uploaded`        | User uploads/pastes an image        |
| `bg_changed`            | User changes background             |
| `exported`              | User exports the final image        |
| `tool_used`             | User uses a tool (blur, text, etc.) |
| `ratio_changed`         | User changes aspect ratio           |
| `shadow_toggled`        | User toggles shadow on/off          |
| `corner_radius_changed` | User changes corner radius          |

**Example Request:**

```typescript
// Using tRPC client
await trpc.analytics.logEvent.mutate({
  type: "exported",
});

await trpc.analytics.logEvent.mutate({
  type: "tool_used",
  tool: "blur",
});
```

**Response:**

```typescript
{
  ok: true;
}
```

**Side Effects:**

Backend automatically captures:

- IP address → Geolocation (country, region)
- User-Agent → Browser, OS, device type

---

### `analytics.getStats`

Get dashboard statistics for the admin panel.

**Authentication:** Admin required

**Input:** None

**Response:**

```typescript
{
  totalExports: number; // Total exported images
  totalUploads: number; // Total uploaded images
  totalEvents: number; // Total events of all types
  exportsToday: number; // Exports in the last 24 hours
  topCountries: Array<{
    country: string;
    count: number;
  }>;
  topBrowsers: Array<{
    browser: string;
    count: number;
  }>;
  topDevices: Array<{
    device: string;
    count: number;
  }>;
  eventsOverTime: Array<{
    date: string; // YYYY-MM-DD
    count: number;
  }>;
}
```

**Example Request:**

```typescript
const stats = await trpc.analytics.getStats.query();
```

**Example Response:**

```json
{
  "totalExports": 1234,
  "totalUploads": 5678,
  "totalEvents": 15000,
  "exportsToday": 42,
  "topCountries": [
    { "country": "US", "count": 500 },
    { "country": "DE", "count": 300 }
  ],
  "topBrowsers": [
    { "browser": "Chrome", "count": 800 },
    { "browser": "Safari", "count": 400 }
  ],
  "topDevices": [
    { "device": "desktop", "count": 1000 },
    { "device": "mobile", "count": 400 }
  ],
  "eventsOverTime": [
    { "date": "2024-01-01", "count": 50 },
    { "date": "2024-01-02", "count": 75 }
  ]
}
```

---

### `analytics.getRecentEvents`

Get paginated list of recent events for the admin table.

**Authentication:** Admin required

**Input:**

| Field | Type   | Required | Default | Description              |
| ----- | ------ | -------- | ------- | ------------------------ |
| page  | number | No       | 1       | Page number (1-indexed)  |
| limit | number | No       | 50      | Items per page (max 100) |
| type  | enum   | No       | -       | Filter by event type     |

**Response:**

```typescript
{
  events: Array<{
    id: string;
    type: string;
    tool: string | null;
    meta: string | null;
    country: string | null;
    region: string | null;
    browser: string | null;
    os: string | null;
    device: string | null;
    createdAt: string; // ISO 8601
  }>;
  total: number; // Total matching events
  pages: number; // Total pages
}
```

**Example Request:**

```typescript
// Get first page
const result = await trpc.analytics.getRecentEvents.query();

// Get page 2 with filter
const result = await trpc.analytics.getRecentEvents.query({
  page: 2,
  limit: 25,
  type: "exported",
});
```

**Example Response:**

```json
{
  "events": [
    {
      "id": "clx123abc",
      "type": "exported",
      "tool": null,
      "meta": null,
      "country": "US",
      "region": "CA",
      "browser": "Chrome",
      "os": "macOS",
      "device": "desktop",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1234,
  "pages": 25
}
```

---

## Using the API

### From Web App

```typescript
// apps/web/lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@snap-it/backend/src/router";

export const trpc = createTRPCReact<AppRouter>();

// Usage in component
const { data } = trpc.analytics.getStats.useQuery();
```

### From Admin App

```typescript
// Same as web app, but queries require admin auth cookie
const { data } = trpc.analytics.getRecentEvents.useQuery({
  page: 1,
  type: "exported",
});
```

### Direct HTTP (curl)

```bash
# Log event
curl -X POST http://localhost:9000/trpc/analytics.logEvent \
  -H "Content-Type: application/json" \
  -d '{"type":"exported"}'

# Get stats (requires admin cookie)
curl http://localhost:9000/trpc/analytics.getStats
```

## Error Handling

All errors are returned in tRPC format:

```typescript
{
  "error": {
    "json": {
      "message": "Error message",
      "code": -32600,  // JSON-RPC error code
      "data": {
        "code": "BAD_REQUEST",
        "path": "analytics.logEvent"
      }
    }
  }
}
```

### Common Error Codes

| Code                    | Meaning             |
| ----------------------- | ------------------- |
| `BAD_REQUEST`           | Invalid input       |
| `UNAUTHORIZED`          | Admin auth required |
| `INTERNAL_SERVER_ERROR` | Server error        |

## Type Safety

Import types from the backend:

```typescript
import type { AppRouter } from "@snap-it/backend/src/router";
import type { DashboardStats, AnalyticsEvent } from "@snap-it/types";
```

## Next Steps

- [Architecture Overview](../architecture/overview.md) — how the API fits in
- [Development Guide](../guides/development.md) — adding new endpoints
- [Environment Variables](../reference/env-vars.md) — configuration
