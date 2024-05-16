import { omit } from "radash";
import nookies from "nookies";
import { z } from "zod";
import { client } from "~/stores";

import { http } from "~/libs/axios";
import dayjs from "dayjs";
import { HttpError } from "~/@types";

type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: HttpError | Error | null | undefined;
  [key: string]: unknown;
};

export interface Profile {
  data: any;
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email tidak boleh kosong",
    })
    .email({
      message: "Email tidak valid",
    }),
  password: z.string().min(8, {
    message: "Kata sandi minimal 8 karakter",
  }),
});

export const registerSchema = loginSchema
  .merge(
    z.object({
      name: z.string().min(1, {
        message: "Username tidak boleh kosong",
      }),
      whatsapp: z
        .string()
        .min(1, {
          message: "Nomor whatsapp tidak boleh kosong",
        })
        .regex(new RegExp(/^0[1-9][0-9]{6,11}$/), {
          message: "Format nomor tidak sesuai ",
        }),

      userCategory: z.string().min(1, {
        message: "Kategori tidak boleh kosong",
      }),
      email: z
        .string()
        .min(1, {
          message: "Email tidak boleh kosong",
        })
        .email({
          message: "Email tidak valid",
        }),
      confirmPassword: z.string().min(1, {
        message: "Konfirmasi password tidak boleh kosong",
      }),
    }),
  )
  .refine((v) => v.password === v.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })
  .transform((v) => {
    return omit(v, ["confirmPassword"]);
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email tidak boleh kosong",
    })
    .email({
      message: "Email tidak valid",
    }),
});

export const setPasswordSchema = loginSchema
  .pick({
    password: true,
  })
  .merge(
    z.object({
      confirmPassword: z.string().min(1, {
        message: "Konfirmasi password tidak boleh kosong",
      }),
      token: z.string(),
    }),
  )
  .refine((v) => v.password === v.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })
  .transform((v) => {
    return omit(v, ["confirmPassword"]);
  });

export const updatePasswordSchema = loginSchema
  .pick({
    password: true,
  })
  .merge(
    z.object({
      oldPassword: z.string().min(1, {
        message: "Kata sandi lama tidak boleh kosong",
      }),

      confirmPassword: z.string().min(1, {
        message: "Konfirmasi password tidak boleh kosong",
      }),
    }),
  )
  .refine((v) => v.password === v.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })
  .transform((v) => {
    return omit(v, ["confirmPassword"]);
  });

export const userSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Nama minimal 3 karakter",
      })

      .nullable(),
    email: z.string().email().nullable(),
    whatsapp: z
      .string()
      .min(1, {
        message: "Nomor whatsapp tidak boleh kosong",
      })
      .regex(new RegExp(/^0[1-9][0-9]{6,11}$/), {
        message: "Format nomor tidak sesuai ",
      }),

    userCategory: z.string().nullable(),
    avatar: z.string().nullable(),
    gender: z.enum(["male", "female"]).nullable(),
    nik: z
      .string()
      .length(16, {
        message: "Maksimal 16 Digit NIK",
      })
      // .min(1, {
      //   message: "NIK tidak boleh kosong",
      // })
      // .max(16, {
      //   message: "NIK tidak boleh melebihi 16 karakter",
      // })
      .nullable(),
    province: z.number().nullable(),
    regency: z.number().nullable(),
    district: z.number().nullable(),
    village: z.number().nullable(),
    address: z.string().nullable(),
    birthPlace: z.string().nullable(),
    birthDate: z
      .string()

      .nullable()
      .transform((v) => {
        if (v) {
          const normalizeDate = dayjs(v).startOf("day").toISOString();

          return normalizeDate;
        }
      }),
  })
  .partial();

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.input<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type SetPasswordSchema = z.input<typeof setPasswordSchema>;
export type UserSchema = z.input<typeof userSchema>;
export type UpdatePasswordSchema = z.input<typeof updatePasswordSchema>;

type AuthBindings = {
  getMe: () => Promise<Profile>;
  login: (params: LoginSchema) => Promise<AuthActionResponse>;
  logout: () => Promise<AuthActionResponse>;
  register: (params: RegisterSchema) => Promise<AuthActionResponse>;
  forgotPassword: (params: ForgotPasswordSchema) => Promise<AuthActionResponse>;
  setPassword: (params: SetPasswordSchema) => Promise<AuthActionResponse>;
  updateProfile: (params: UserSchema) => Promise<Profile>;
  updatePassword: (params: UpdatePasswordSchema) => Promise<Profile>;
};

export interface ResponseAuth {
  data: {
    accessToken: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export const auth: AuthBindings = {
  getMe: async () => {
    const res = await http<Profile>("GET", {
      url: "/auth/profile",
    });

    return res;
  },
  login: async (value) => {
    const result = await http<ResponseAuth>("POST", {
      url: "/auth/login",
      data: {
        ...value,
        role: "user",
        notificationToken: client.getQueryData(["fcmToken"]),
      },
    });

    if (result.success) {
      nookies.set(null, "token", result.data.accessToken, {
        maxAge: 24 * 60 * 60,
        path: "/",
      });
    }

    return { success: false, error: result.error };
  },
  register: async (value) => {
    const result = await http<ResponseAuth>("POST", {
      url: "/auth/register",
      data: value,
    });

    return { success: false, error: result.error };
  },
  logout: async () => {
    const res = await http<unknown>("POST", {
      url: "/auth/logout",
    });

    if (res.success) {
      nookies.destroy(null, "token", {
        path: "/",
      });

      client.removeQueries({
        queryKey: ["profile"],
      });

      client.removeQueries({
        queryKey: ["isLogin"],
      });

      return {
        success: true,
        redirectTo: "/",
        error: null,
      };
    }

    return {
      ...res,
    };
  },
  forgotPassword: async (value) => {
    const result = await http<unknown>("POST", {
      url: "/auth/password/forgot",
      data: value,
    });

    if (result.success) {
      return {
        ...result,
        success: true,
      };
    }

    return { success: false, error: result.error };
  },
  setPassword: async (value) => {
    const result = await http<unknown>("POST", {
      url: "/auth/password/update",
      data: value,
    });

    if (result.success) {
      return {
        ...result,
        success: true,
      };
    }

    return { success: false, error: result.error };
  },
  updateProfile: async (value) => {
    const result = await http<Profile>("PUT", {
      url: "/user",
      data: value,
    });

    return result;
  },
  updatePassword: async (value) => {
    const result = await http<Profile>("PUT", {
      url: "/user/password",
      data: value,
    });

    return result;
  },
};
