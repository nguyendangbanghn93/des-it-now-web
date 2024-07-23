import { createWithEqualityFn } from "zustand/traditional";

interface IToast {
  type?: "error" | "info" | "success" | "warning";
  open?: boolean;
  message?: string;
}

interface IGlobalState {
  loading: boolean;
  toast: IToast;
}

interface IGlobalActions {
  setLoading: (open: boolean) => void;
  setToast: (option: IToast) => void;
}

type IGlobalStore = IGlobalState & IGlobalActions;

const initialState: IGlobalState = {
  loading: false,
  toast: { open: false },
};

const useGlobalStore = createWithEqualityFn<IGlobalStore>()((set) => ({
  ...initialState,
  setToast: (option) => set({ toast: option }),
  setLoading: (open) => set({ loading: open }),
}));

export default useGlobalStore;
