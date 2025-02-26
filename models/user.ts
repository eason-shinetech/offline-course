import { z } from "zod";

export const registerFormSchema = z
  .object({
    userName: z.string().min(3, { message: "用户名至少 3 个字符" }),
    email: z.string().email({ message: "无效的邮箱格式" }),
    password: z.string().min(6, { message: "密码至少 6 个字符" }),
    confirm: z.string().min(6, { message: "密码至少 6 个字符" }),
    code: z.string().min(6, { message: "验证码至少 6 个字符" }),
  })
  .refine(
    (data) => {
      return data.password === data.confirm;
    },
    {
      message: "两次密码不匹配",
      path: ["confirm"],
    }
  );

export const loginFormSchema = z.object({
  userName: z.string().min(3, { message: "用户名至少 3 个字符" }),
  password: z.string().min(6, { message: "密码至少 6 个字符" }),
});

export const forgetFormSchema = z.object({
  userName: z.string().min(3, { message: "用户名至少 3 个字符" }),
  code: z.string().min(6, { message: "验证码至少 6 个字符" }),
});

export const resetPasswordFormSchema = z
  .object({
    userName: z.string().min(3, { message: "用户名至少 3 个字符" }),
    password: z.string().min(6, { message: "密码至少 6 个字符" }),
    confirm: z.string().min(6, { message: "密码至少 6 个字符" })
  })
  .refine(
    (data) => {
      return data.password === data.confirm;
    },
    {
      message: "两次密码不匹配",
      path: ["confirm"],
    }
  );

export interface LoginResult {
  jwt: string;
  user: User;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  role: string;
}

export enum UserRole {
  ADMIN = "admin",
  VIP = "vip",
  USER = "user",
}
