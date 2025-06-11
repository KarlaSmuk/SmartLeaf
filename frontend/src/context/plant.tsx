import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type PlantData, initialPlantsData } from "../api/plants";

type PlantContextType = {
  plants: PlantData[];
  setPlants: React.Dispatch<React.SetStateAction<PlantData[]>>;
};

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider = ({ children }: { children: ReactNode }) => {
  const [plants, setPlants] = useState<PlantData[]>(initialPlantsData);

  return (
    <PlantContext.Provider value={{ plants, setPlants }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = (): PlantContextType => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error("usePlantContext must be used within a PlantProvider");
  }
  return context;
};
