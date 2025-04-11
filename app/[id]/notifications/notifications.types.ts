export type Notification = {
  id: string;
  type:
    | "TEMPERATURE_ALERT"
    | "SECURITY_ALERT"
    | "POWER_USAGE_ALERT"
    | "MAINTENANCE_NOTICE"
    | "ACCESS_REQUEST"
    | "ANOMALY_DETECTED";
  title: string;
  message: string;
  time?: string;
  read: boolean;
  severity: "low" | "medium" | "high";
  priority?: "low" | "medium" | "high";
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
