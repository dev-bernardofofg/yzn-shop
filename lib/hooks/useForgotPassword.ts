"use client"

import type { Client, RequestConfig, ResponseErrorConfig } from "@kubb/plugin-client/clients/axios";
import type { UseMutationOptions, UseMutationResult, QueryClient } from "@tanstack/react-query";
import fetch from "@kubb/plugin-client/clients/axios";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import type { Error as ApiError } from "@/generated/types/Error";

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

async function forgotPassword(
  data: ForgotPasswordRequest,
  config: Partial<RequestConfig<ForgotPasswordRequest>> & { client?: Client } = {}
) {
  const { client: request = fetch, ...requestConfig } = config;
  const res = await request<ForgotPasswordResponse, ResponseErrorConfig<ApiError>, ForgotPasswordRequest>({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/auth/forgot-password`,
    data,
    ...requestConfig,
  });
  return res.data;
}

export const forgotPasswordMutationKey = () => [{ url: "/auth/forgot-password" }] as const;

export function useForgotPassword<TContext>(
  options: {
    mutation?: UseMutationOptions<ForgotPasswordResponse, ResponseErrorConfig<ApiError>, { data: ForgotPasswordRequest }, TContext> & { client?: QueryClient };
    client?: Partial<RequestConfig<ForgotPasswordRequest>> & { client?: Client };
  } = {}
) {
  const { mutation = {}, client: config = {} } = options;
  const { client: queryClient, ...mutationOpts } = mutation;

  return useMutation<ForgotPasswordResponse, ResponseErrorConfig<ApiError>, { data: ForgotPasswordRequest }, TContext>(
    {
      ...mutationOptions({
        mutationKey: forgotPasswordMutationKey(),
        mutationFn: async ({ data }) => forgotPassword(data, config),
      }),
      mutationKey: forgotPasswordMutationKey(),
      ...mutationOpts,
    },
    queryClient
  ) as UseMutationResult<ForgotPasswordResponse, ResponseErrorConfig<ApiError>, { data: ForgotPasswordRequest }, TContext>;
}
