import React, { createContext, useContext, useState } from "react";
import type { SensorAlert } from "../hooks/useHomeAssistantWebSocket";

type AlertContextType = {
  alerts: SensorAlert[];
  addAlert: (alert: SensorAlert) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);

  const addAlert = (alert: SensorAlert) => {
    setAlerts((prev) => [...prev, alert]);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};
