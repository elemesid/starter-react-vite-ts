import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { UseFormProps } from "react-hook-form";
import { useForm } from "~/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type LoginSchema,
  auth,
  type RegisterSchema,
  ForgotPasswordSchema,
  SetPasswordSchema,
  AuthActionResponse,
} from "~/services";
import { ZodEffects, ZodType, ZodTypeAny } from "zod";
import { HttpError } from "~/@types";

type AuthType = "login" | "register" | "forgotPassword" | "setPassword";

type AuthSchema = {
  login: LoginSchema;
  register: RegisterSchema;
  forgotPassword: ForgotPasswordSchema;
  setPassword: SetPasswordSchema;
};

type AuthFunctions = {
  [K in AuthType]: (data: AuthSchema[K]) => Promise<AuthActionResponse>;
};

const authFunctions: AuthFunctions = {
  login: auth.login,
  register: auth.register,
  forgotPassword: auth.forgotPassword,
  setPassword: auth.setPassword,
};

export const useAuth = <T extends AuthType>(
  type: T,
  resolver: ZodType<AuthSchema[T]> | ZodEffects<ZodTypeAny>,
  opts?: Omit<UseFormProps<AuthSchema[T]>, "resolver">,
  optsMutation?: UseMutationOptions<AuthActionResponse, HttpError, AuthSchema[T]>,
) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthSchema[T]>({
    ...opts,
    resolver: zodResolver(resolver),
  });

  const mutation = useMutation<AuthActionResponse, HttpError, AuthSchema[T]>({
    ...optsMutation,
    mutationKey: [type],
    mutationFn: async (v) => {
      return authFunctions[type](v);
    },
  });

  return {
    control,
    errors,
    mutation,
    onSubmit: handleSubmit((v) => mutation.mutate(v)),
  };
};
