import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  token?: string;
  userId?: string;
  etmsId?: number;
  etmsToken?: string;
  employeeId?: string;
  username?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string | null;
  deviceStatus?: number;
  medicalStatus?: boolean;
  formTitle?: string;
  adminRole?: string;
  covid_fpt?: boolean;
  olympic?: boolean;
  iPaper?: boolean;
  stayInterview?: boolean;
  eCheck?: boolean;
  gridItemFunctions?: any[];
  ePurchase_api?: string;
  ePayment_api?: string;
  key_ePurchase_ePayment?: string;
  key_ePayment?: string;
  key_ePurchase?: string;
  [key: string]: any;
}

interface UserStore {
  userData: UserData | null;
  isAuthenticated: boolean;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
  getToken: () => string | undefined;
  setAuthenticated: (status: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userData: null,
      isAuthenticated: false,
      setUserData: (data) => set({ userData: data, isAuthenticated: true }),
      clearUserData: () => set({ userData: null, isAuthenticated: false }),
      getToken: () => get().userData?.token,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        userData: state.userData, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 