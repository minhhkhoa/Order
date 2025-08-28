import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.clientNextLogin,
  });
};
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.clientNextLogout,
  });
};

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.setTokenToCookie,
  });
};
