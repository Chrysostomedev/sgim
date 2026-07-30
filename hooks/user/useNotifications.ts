"use client";

import { useState, useEffect, useCallback } from "react";

export interface Notification {
  id: number;
  title: string;
  summary: string;
  source: NotifSource;
  read: boolean;
  createdAt: string;
}

export type NotifSource = "project" | "task" | "subtask" | "event" | "member" | "status" | "système";

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "Rapport mensuel", summary: "Rapport SAR juillet disponible", source: "système", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, title: "Formation", summary: "Session MEDEVAC prévue", source: "event", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, unreadCount, markAsRead, markAllAsRead, remove };
}
