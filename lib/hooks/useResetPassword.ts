"use client"

import type { Client, RequestConfig, ResponseErrorConfig } from "@kubb/plugin-client/clients/axios";
import type { UseMutationOptions, UseMutationResult, QueryClient } from "@tanstack/react-query";
import fetch from "@kubb/plugin-client/clients/axios";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import type { Error as ApiError } from "@/generated/types/Error";

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};

async function resetPassword(
  data: ResetPasswordRequest,
  config: Partial<RequestConfig<ResetPasswordRequest>> & { client?: Client } = {}
) {
  const { client: request = fetch, ...requestConfig } = config;
  const res = await request<ResetPasswordResponse, ResponseErrorConfig<ApiError>, ResetPasswordRequest>({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/auth/reset-password`,
    data,
    ...requestConfig,
  });
  return res.data;
}

export const resetPasswordMutationKey = () => [{ url: "/auth/reset-password" }] as const;

export function useResetPassword<TContext>(
  options: {
    mutation?: UseMutationOptions<ResetPasswordResponse, ResponseErrorConfig<ApiError>, { data: ResetPasswordRequest }, TContext> & { client?: QueryClient };
    client?: Partial<RequestConfig<ResetPasswordRequest>> & { client?: Client };
  } = {}
) {
  const { mutation = {}, client: config = {} } = options;
  const { client: queryClient, ...mutationOpts } = mutation;

  return useMutation<ResetPasswordResponse, ResponseErrorConfig<ApiError>, { data: ResetPasswordRequest }, TContext>(
    {
      ...mutationOptions({
        mutationKey: resetPasswordMutationKey(),
        mutationFn: async ({ data }) => resetPassword(data, config),
      }),
      mutationKey: resetPasswordMutationKey(),
      ...mutationOpts,
    },
    queryClient
  ) as UseMutationResult<ResetPasswordResponse, ResponseErrorConfig<ApiError>, { data: ResetPasswordRequest }, TContext>;
}
