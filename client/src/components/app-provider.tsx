"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //- Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
