"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export default interface solverData {
  quantity: number;
  itemsPerMinute: number;
  itemsPerSecond: number;
  recipeTime: number;
  machinesValue: number;
  machineSpeed: number;
  editable: boolean;
}

interface PropertiesContextType {
  solverData: solverData;
  setSolverData: React.Dispatch<React.SetStateAction<solverData>>;
  recipeToggled: boolean;
  setRecipeToggled: (toggled: boolean) => void;
  recipeSelected: string;
  setRecipeSelected: (recipe: string) => void;
  allowedDrills: string[];
  setAllowedDrills: (machines: string[]) => void;
  allowedMachines: string[];
  setAllowedMachines: (machines: string[]) => void;
  allowedSmelters: string[];
  setAllowedSmelters: (machines: string[]) => void;
  itemSelected: string;
  setItemSelected: (item: string) => void;
  itemBrowserOpen: boolean;
  setItemBrowserOpen: (open: boolean) => void;
  assemblerSelected: string;
  setAssemblerSelected: (assembler: string) => void;
  assemblerBrowserOpen: boolean;
  setAssemblerBrowserOpen: (open: boolean) => void;
  drillSelected: string;
  setDrillSelected: (drill: string) => void;
  drillBrowserOpen: boolean;
  setDrillBrowserOpen: (open: boolean) => void;
  smelterSelected: string;
  setSmelterSelected: (smelter: string) => void;
  smelterBrowserOpen: boolean;
  setSmelterBrowserOpen: (open: boolean) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(
  undefined
);

interface PropertiesProviderProps {
  children: ReactNode;
}

export const PropertiesProvider: React.FC<PropertiesProviderProps> = ({
  children,
}) => {
  const [solverData, setSolverData] = useState({
    quantity: 1,
    itemsPerMinute: 60,
    itemsPerSecond: 1,
    machinesValue: 1,
    recipeTime: 6,
    machineSpeed: 1,
    editable: false,
  });

  const [recipeToggled, setRecipeToggled] = useState<boolean>(false);
  const [recipeSelected, setRecipeSelected] = useState<string>("");
  const [allowedDrills, setAllowedDrills] = useState<string[]>([]);
  const [allowedMachines, setAllowedMachines] = useState<string[]>([]);
  const [allowedSmelters, setAllowedSmelters] = useState<string[]>([]);

  const [itemSelected, setItemSelected] = useState<string>("ironPlate");
  const [itemBrowserOpen, setItemBrowserOpen] = useState<boolean>(false);

  const [assemblerSelected, setAssemblerSelected] = useState<string>("assemblingMachine1");
  const [assemblerBrowserOpen, setAssemblerBrowserOpen] =
    useState<boolean>(false);

  const [drillSelected, setDrillSelected] = useState<string>(
    "electricMiningDrill"
  );
  const [drillBrowserOpen, setDrillBrowserOpen] = useState<boolean>(false);

  const [smelterSelected, setSmelterSelected] =
    useState<string>("stoneFurnace");
  const [smelterBrowserOpen, setSmelterBrowserOpen] = useState<boolean>(false);

  return (
    <PropertiesContext.Provider
      value={{
        solverData,
        setSolverData,
        recipeToggled,
        setRecipeToggled,
        recipeSelected,
        setRecipeSelected,
        allowedDrills,
        setAllowedDrills,
        allowedMachines,
        setAllowedMachines,
        allowedSmelters,
        setAllowedSmelters,
        itemSelected,
        setItemSelected,
        itemBrowserOpen,
        setItemBrowserOpen,
        assemblerSelected,
        setAssemblerSelected,
        assemblerBrowserOpen,
        setAssemblerBrowserOpen,
        drillSelected,
        setDrillSelected,
        drillBrowserOpen,
        setDrillBrowserOpen,
        smelterSelected,
        setSmelterSelected,
        smelterBrowserOpen,
        setSmelterBrowserOpen,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = (): PropertiesContextType => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
};
