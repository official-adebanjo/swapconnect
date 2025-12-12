"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";
import type {
  Notification,
  NotificationResponse,
  UnreadCountResponse,
  NotificationPreferences,
} from "@/types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const token = useAuthToken();

  const fetchNotifications = useCallback(
    async (page = 1, limit = 20, unreadOnly = false) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await api.get<NotificationResponse["data"]>(
          `/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
          token
        );

        if (response.success && response.data) {
          setNotifications(response.data.notifications);
        } else {
          setError(response.error || "Failed to fetch notifications");
        }
      } catch (err) {
        setError("Error fetching notifications");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await api.get<UnreadCountResponse["data"]>(
        "/notifications/unread-count",
        token
      );

      if (response.success && response.data) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [token]);

  const fetchPreferences = useCallback(async () => {
    if (!token) return;

    try {
      const response = await api.get<{ data: NotificationPreferences }>(
        "/notifications/preferences",
        token
      );

      if (response.success && response.data) {
        setPreferences(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching notification preferences:", err);
      setPreferences({
        emailNotifications: false,
        pushNotifications: false,
      });
    }
  }, [token]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!token) return;

      try {
        const response = await api.put(
          `/notifications/${notificationId}/read`,
          {},
          token
        );

        if (response.success) {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    },
    [token]
  );

  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      const response = await api.put("/notifications/mark-all-read", {}, token);

      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, [token]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      if (!token) return;

      try {
        const response = await api.delete(
          `/notifications/${notificationId}`,
          token
        );

        if (response.success) {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notificationId)
          );
          // Refresh unread count
          fetchUnreadCount();
        }
      } catch (err) {
        console.error("Error deleting notification:", err);
      }
    },
    [token, fetchUnreadCount]
  );

  const updatePreferences = useCallback(
    async (newPreferences: Partial<NotificationPreferences>) => {
      if (!token) return false;

      try {
        const response = await api.put(
          "/notifications/preferences",
          newPreferences,
          token
        );

        if (response.success) {
          setPreferences((prev) => ({ ...prev, ...newPreferences }));
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error updating notification preferences:", err);
        return false;
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
      fetchPreferences();
    }
  }, [token, fetchNotifications, fetchUnreadCount, fetchPreferences]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    preferences,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    refetch: () => {
      fetchNotifications();
      fetchUnreadCount();
    },
  };
}
