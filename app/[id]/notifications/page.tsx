"use client";
import { useEffect, useState } from "react";
import { baseUrl } from "@/api/axios.config";
import NotificationCenter from "@/components/notification-center";
import NotificationFilters from "@/components/notification-filters";
import { EventSource } from "event-source-polyfill";
import getConfig from "next/config";
import useGetNotifications from "./useGetNotifications";
import { Notification } from "./notifications.types";

export default function NotificationsPage() {
  const { data } = useGetNotifications();
  const [notifications, setNotifications] = useState(data);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationCenter initialNotifications={notifications} />
    </main>
  );
}
