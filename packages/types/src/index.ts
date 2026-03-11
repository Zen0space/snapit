// Analytics event types shared between web, admin, and backend

export type EventType =
  | "image_uploaded"
  | "bg_changed"
  | "exported"
  | "shadow_toggled";

export type DeviceType = "desktop" | "mobile" | "tablet";

export type ActiveTool = "select" | "text" | "blur";

export interface LogEventInput {
  type: EventType;
  tool?: string;
  meta?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  tool: string | null;
  meta: string | null;
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
  totalEvents: number;
  exportsToday: number;
  topCountries: Array<{ country: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  eventsOverTime: Array<{ date: string; count: number }>;
}
