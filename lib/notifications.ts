import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'validation' | 'rejection' | 'order' | 'content' | 'system';
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Subscribe to real-time notifications for a user
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'notifications', userId, 'items'),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Notification[];
    callback(notifs);
  });
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<void> {
  const notifRef = doc(db, 'notifications', userId, 'items', notificationId);
  await updateDoc(notifRef, { read: true });
}

/**
 * Send a notification to a user (call from server-side API routes)
 */
export async function sendNotification(
  userId: string,
  notification: {
    title: string;
    body: string;
    type: string;
    data?: Record<string, unknown>;
  }
): Promise<void> {
  await addDoc(collection(db, 'notifications', userId, 'items'), {
    ...notification,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Send an admin alert
 */
export async function sendAdminAlert(alert: {
  type: 'new_partner' | 'new_submission' | 'new_order';
  message: string;
  targetId: string;
}): Promise<void> {
  await addDoc(collection(db, 'admin_alerts'), {
    ...alert,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Subscribe to admin alerts (real-time)
 */
export function subscribeToAdminAlerts(
  callback: (alerts: Array<{ id: string; type: string; message: string; read: boolean; createdAt: Date }>) => void
): Unsubscribe {
  const q = query(
    collection(db, 'admin_alerts'),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Array<{ id: string; type: string; message: string; read: boolean; createdAt: Date }>;
    callback(alerts);
  });
}
