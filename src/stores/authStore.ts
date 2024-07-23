import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IUser {
  id: string;
  name: string;
  // Thêm các trường khác mà bạn cần
}

interface IAuthState {
  token: string | null;
  user?: IUser;
}

interface IAuthActions {
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
    (set) => ({
      ...initialState,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ ...initialState }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
