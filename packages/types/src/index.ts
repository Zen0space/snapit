// Analytics event types shared between web, admin, and backend

export type EventType =
  | "image_uploaded"
  | "bg_changed"
  | "exported"
  | "copied"
  | "shadow_toggled";

export type DeviceType = "desktop" | "mobile" | "tablet";

export type ActiveTool = "select" | "text" | "blur";

/** Cookie consent level chosen by the visitor. */
export type ConsentLevel = "all" | "necessary";

export interface LogEventInput {
  type: EventType;
  tool?: string;
  meta?: string;
  visitorId?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  tool: string | null;
  meta: string | null;
  visitorId: string | null;
  country: string | null;
  region: string | null;
  browser: string | null;
  os: string | null;
  device: DeviceType | null;
  createdAt: string;
}

export interface DashboardStats {
  totalExports: number;
  totalUploads: number;
  totalCopies: number;
  totalEvents: number;
  exportsToday: number;
  copiesToday: number;
  topCountries: Array<{ country: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  eventsOverTime: Array<{ date: string; count: number }>;
}

/** One record per anonymous visitor — their consent choice + aggregate event count. */
export interface CookieConsentRecord {
  id: string;
  visitorId: string;
  consent: ConsentLevel;
  eventCount: number;
  createdAt: string;
  updatedAt: string;
}
