"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import { createContext, useContext, useEffect, useState } from "react";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //- refetchOnWindowFocus sẽ không tự động fetch lại api khi go back focus tab
      refetchOnWindowFocus: false,

      //- refetchOnMount sẽ không tự động fetch lại api khi mount
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<RoleType | undefined>();

  useEffect(() => {
    const acccessToken = getAccessTokenFromLocalStorage();

    if (acccessToken) {
      const role = decodeToken(acccessToken).role;
      setRoleState(role);
    }
  }, []);

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  };

  const isAuth = Boolean(role);

  return (
    //- Provide the client to your App
    <AppContext value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  );
}
