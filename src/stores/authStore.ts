import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IAuthState {
  token: string | null;
  user?: IUser;
  refetch?: () => void;
}

interface IAuthActions {
  setRefetchUser: (refetch: () => void) => void;
  refetchUser: () => void;
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
}

type IAuthStore = IAuthState & IAuthActions;

const initialState: IAuthState = {
  token: null,
  user: undefined,
};

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setToken: (token) => set((s) => ({ ...s, token })),
      setUser: (user) => set((s) => ({ ...s, user })),
      logout: () => set({ ...initialState }),
      setRefetchUser: (refetch) => set((s) => ({ ...s, refetch })),
      refetchUser: () => {
        get().refetch?.();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
