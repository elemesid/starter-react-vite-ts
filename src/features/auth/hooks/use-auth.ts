import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginSchema, auth, type RegisterSchema, ResponseAuth } from "~/services";
import { ZodEffects, ZodType, ZodTypeAny } from "zod";
// import { useDisClosure } from "~/hooks";
// import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { HttpError } from "~/@types";
// import { useToast } from "~/context/Toast";

type AuthType = "login" | "register";

type AuthSchema = {
  login: LoginSchema;
  register: RegisterSchema;
};

const authFunctions: Record<AuthType, (data: any) => Promise<any>> = {
  login: auth.login,
  register: auth.register,
};

export const useAuth = <T extends AuthType>(
  type: T,
  resolver: ZodType<AuthSchema[T]> | ZodEffects<ZodTypeAny>,
  opts?: Omit<UseFormProps<AuthSchema[T]>, "resolver">,
  optsMutation?: UseMutationOptions<ResponseAuth, HttpError, AuthSchema[T]>,
) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthSchema[T]>({
    ...opts,
    resolver: zodResolver(resolver),
  });

  const mutation = useMutation<ResponseAuth, HttpError, AuthSchema[T]>({
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
