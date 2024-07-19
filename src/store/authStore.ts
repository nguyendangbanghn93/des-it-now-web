import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface IAuthState {
  token: string | null;
  user?: any;
}

interface IAuthActions {
  setToken: (token: string) => void;
  clearToken: () => void;
  reset: () => void;
}

type IAuthStore = IAuthState & IAuthActions;

const initialState: IAuthState = {
  token: null,
  user: null,
};

const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    } as PersistOptions<IAuthStore>
  )
);

export default useAuthStore;
