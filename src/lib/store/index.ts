import { create } from "zustand";
import { RouterOutputs } from "../api";

type MapStore = {
  zoom: number;
  isMovePin: boolean;
  setStoreMapZoom: (zoom: number) => void;
  setIsMovePin: (isMovePin: boolean) => void;
  mapData: RouterOutputs["maps"]["getMapDataById"];
  setMapData: (mapData: RouterOutputs["maps"]["getMapDataById"]) => void;
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
};

export const useMapStore = create<MapStore>()((set) => ({
  isMovePin: false,
  zoom: 0,
  setIsMovePin: (isMovePin) => set({ isMovePin }),
  setStoreMapZoom: (zoom) => set({ zoom }),
  mapData: undefined,
  setMapData: (mapData) => set({ mapData }),
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));

type FormStore = {
  isFormOpen: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
  id: string;
  setId: (id: string) => void;
};

export const useFormStore = create<FormStore>()((set) => ({
  isFormOpen: false,
  setIsFormOpen: (isFormOpen) => set({ isFormOpen }),
  id: "",
  setId: (id) => set({ id }),
}));
