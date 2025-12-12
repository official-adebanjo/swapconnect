"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { API_URL } from "@/lib/config";
import { useAuthToken } from "@/hooks/useAuthToken";

interface Notification {
  id: string;
  message: string;
  status: "unread" | "read";
  created_at: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = useAuthToken();

  useEffect(() => {
    if (!token || !userId) return; // ✅ Both vars used here

    fetch(`${API_URL}/notifications?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.data?.notifications)) {
          setNotifications(data.data.notifications);
        } else {
          console.error("Unexpected response format", data);
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      });
  }, [token, userId]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="relative" onClick={() => setOpen((prev) => !prev)}>
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border shadow-lg rounded-md z-50 p-3">
          <h4 className="text-sm font-semibold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded mb-2 text-sm ${
                  n.status === "unread"
                    ? "bg-gray-100 font-medium"
                    : "text-gray-500"
                }`}
              >
                {n.message}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
