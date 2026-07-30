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
  { id: 1, title: "Nouveau projet", summary: "Projet SAR Atlantic créé", source: "project", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, title: "Tâche assignée", summary: "Inspection vedette B", source: "task", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, title: "Membre ajouté", summary: "KOUADIO Jean rejoint l'équipe", source: "member", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
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
