import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActivityPreferenceStoreType = {
  activityPath: string;
  setActivityPath: (path: string) => void;
};

export const activityPreferenceStore = create<ActivityPreferenceStoreType>()(
  persist(
    (set) => ({
      activityPath: "/activity/discover",
      setActivityPath: (activityPath) => set({ activityPath }),
    }),
    {
      name: "pf-activity-preference",
    },
  ),
);
