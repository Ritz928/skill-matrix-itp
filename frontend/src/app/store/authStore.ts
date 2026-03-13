import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers } from "../data/mockUsers";
import type { UserRole } from "../data/mockUsers";

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

type AuthState = {
  user: AuthUser | null;
  loginError: string | null;
};

type AuthActions = {
  login: (email: string, password: string) => boolean;
  loginAs: (userId: string) => boolean;
  logout: () => void;
  clearLoginError: () => void;
};

const initialState: AuthState = {
  user: null,
  loginError: null
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login(email, password) {
        const found = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          set({
            user: { id: found.id, name: found.name, role: found.role },
            loginError: null
          });
          return true;
        }
        set({ loginError: "Invalid email or password" });
        return false;
      },

      loginAs(userId: string) {
        const found = mockUsers.find((u) => u.id === userId);
        if (found) {
          set({
            user: { id: found.id, name: found.name, role: found.role },
            loginError: null
          });
          return true;
        }
        set({ loginError: "User not found" });
        return false;
      },

      logout() {
        set(initialState);
      },

      clearLoginError() {
        set({ loginError: null });
      }
    }),
    { name: "skill-matrix-auth", partialize: (state) => ({ user: state.user }) }
  )
);
