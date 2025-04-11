"use client";
"use strict";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Thermometer, Shield, Power, Check, Clock } from "lucide-react";
import type { Notification } from "@/app/[id]/notifications/notifications.types";

export default function NotificationCenter({
  initialNotifications,
}: {
  initialNotifications: any;
}) {

  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(initialNotifications) ? initialNotifications : []
  );


  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setNotifications(initialNotifications);
    }

    return () => {
      isMounted = false;
    };
  }, [initialNotifications]);


  const [activeTab, setActiveTab] = useState("all");

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TEMPERATURE_ALERT":
        return <Thermometer className="h-5 w-5" />;
      case "SECURITY_ALERT":
        return <Shield className="h-5 w-5" />;
      case "POWER_USAGE_ALERT":
        return <Power className="h-5 w-5" />;
      case "MAINTENANCE_NOTICE":
        return <Power className="h-5 w-5" />;
      case "ACCESS_REQUEST":
        return <Bell className="h-5 w-5" />;
      case "ANOMALY_DETECTED":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  const filteredNotifications = (
    Array.isArray(notifications) ? notifications : []
  ).filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((notification) => !notification.read).length
    : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-xl">Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </div>
        <CardDescription>System notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-8 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="TEMPERATURE_ALERT">Temperature</TabsTrigger>
            <TabsTrigger value="SECURITY_ALERT">Security</TabsTrigger>
            <TabsTrigger value="POWER_USAGE_ALERT">Power</TabsTrigger>
            <TabsTrigger value="MAINTENANCE_NOTICE">Maintenance</TabsTrigger>
            <TabsTrigger value="ACCESS_REQUEST">Access</TabsTrigger>
            <TabsTrigger value="ANOMALY_DETECTED">Anomaly</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-md ${!notification.read ? "bg-muted" : ""}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mt-0.5 mr-3 ${getSeverityColor(notification.priority || notification.severity)}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium flex items-center">
                            {notification.title}
                            {notification.priority === "high" && (
                              <Badge variant="destructive" className="ml-2">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {notification.createdAt
                                ? new Date(
                                    notification.createdAt,
                                  ).toLocaleString()
                                : notification.time}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1">{notification.message}</div>
                        {notification.relatedEntityType &&
                          notification.relatedEntityId && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Related: {notification.relatedEntityType}:{" "}
                              {notification.relatedEntityId}
                            </div>
                          )}
                        {!notification.read && (
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""}{" "}
                  notifications at this time
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
