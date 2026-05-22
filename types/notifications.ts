export type NotificationChannel = "email" | "telegram" | "whatsapp" | "in_app";

export type NotificationStatus = "sent" | "failed";

export interface Notification {
  _id?: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  channel: NotificationChannel;
  message: string;
  status: NotificationStatus;
  sentAt: Date;
  readAt?: Date;
  createdAt: Date;
}
