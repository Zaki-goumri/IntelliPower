import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AreaFloor = {
  value: string;
  label: string;
  type: string;
  id: string;
};

type AreaFloorStore = {
  areaFloor: AreaFloor | null;
  setAreaFloor: (areaFloorData: AreaFloor) => void;
};

export const useAreaFloorStore = create<AreaFloorStore>()(
  persist(
    (set) => ({
      areaFloor: null,
      setAreaFloor: (areaFloorData: AreaFloor) =>
        set({ areaFloor: areaFloorData }),
    }),
    {
      name: "area-Floor-name",
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        if (version !== 0) return persistedState;
        return persistedState as AreaFloorStore;
      },
    },
  ),
);
