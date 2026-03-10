import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/lib/registerForPushNotificationsAsync";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

interface NotificationContextType {
   expoPushToken: string | null;
   notification: Notifications.Notification | null;
   error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
   const context = useContext(NotificationContext);
   if (context === undefined) {
      throw new Error("useNotification must be used within a NotificationProvider");
   }
   return context;
};

interface NotificationProviderProps {
   children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
   const storeExpoPushToken = useMutation(api.devices.setExpoPushToken);
   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
   const [notification, setNotification] = useState<Notifications.Notification | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const notificationListener = useRef<Notifications.EventSubscription>();
   const responseListener = useRef<Notifications.EventSubscription>();

   useEffect(() => {
      registerForPushNotificationsAsync().then(
         (token) => {
            setExpoPushToken(token);
            storeExpoPushToken({ token });
         },
         (error) => setError(error)
      );

      notificationListener.current = Notifications.addNotificationReceivedListener(
         (notification) => {
            console.log("🔔 Notification Received");
            setNotification(notification);
         }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
         (response) => {
            // Handle the notification response here
         }
      );

      return () => {
         if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
         }
         if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
         }
      };
   }, []);

   return (
      <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
         {children}
      </NotificationContext.Provider>
   );
};
