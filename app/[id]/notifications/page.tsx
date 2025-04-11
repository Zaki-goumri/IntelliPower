"use client";
import { useEffect, useState } from "react";
import { baseUrl } from "@/api/axios.config";
import NotificationCenter from "@/components/notification-center";
import NotificationFilters from "@/components/notification-filters";
import { EventSource } from "event-source-polyfill";
import getConfig from "next/config";

import { Head } from "react-day-picker";

export default function NotificationsPage() {

  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <NotificationFilters />
        </div>
        <div className="lg:col-span-3">
          <NotificationCenter />
        </div>
      </div>
    </main>
  );
}
