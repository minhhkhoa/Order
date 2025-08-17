"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";

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
  setIsAuth: (isAuth: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuthState] = useState(false);

  useEffect(() => {
    const acccessToken = getAccessTokenFromLocalStorage();

    if (acccessToken) {
      setIsAuthState(true);
    }
  }, []);

  const setIsAuth = (isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true);
    } else {
      setIsAuthState(false);
      removeTokensFromLocalStorage();
    }
  };

  return (
    //- Provide the client to your App
    <AppContext value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  );
}
