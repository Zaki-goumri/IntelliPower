import { create } from "zustand";

type PeriodType = "DAY" | "WEEK" | "MONTH";

type PeriodStore = {
  period: PeriodType;
  setPeriod: () => void;
};

export const usePeriodStore = create<PeriodStore>()((set) => ({
  period: "DAY",
  setPeriod: () => {
    const periods: PeriodType[] = ["DAY", "WEEK", "MONTH"];
    set((state) => {
      const currentIndex = periods.indexOf(state.period);
      const nextIndex = (currentIndex + 1) % periods.length;
      return { period: periods[nextIndex] };
    });
  },
}));
