"use client";
import { SlimLayout } from "@/components/web-layout/SlimLayout";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginResult, Status } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import post from "@/lib/api";

export default function Login() {
  const [status, setStatus] = useState(Status.Idle);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    //清空本地存储
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // 初始化表单
  const form = useForm<z.infer<typeof loginFormSchema>>({
    // 指定表单验证规则
    resolver: zodResolver(loginFormSchema),
    // 验证模式，onChange表示输入框值变化时触发验证
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  // 提交表单
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // 这里的values就是表单的值，是经过验证后的值，是安全的，可以放心使用
    setStatus(Status.Loading);
    const response = await post("auth/login", values, false);
    const data = await response.json();
    if (!response.ok) {
      setStatus(Status.Error);
      //show a toast
      toast({
        variant: "destructive",
        title: "登录失败",
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      return;
    } else {
      // 保存用户信息到本地
      console.log(data);
      const result = data as LoginResult;
      localStorage.setItem("token", result.jwt);
      localStorage.setItem("user", JSON.stringify(result.user));
      //跳转到首页
      router.push("/");
    }
  }
  return (
    <SlimLayout isLogin={true}>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Image
            src="/images/logo.png"
            alt="logo"
            className="h-10 w-auto"
            width={60}
            height={60}
          />
        </Link>
      </div>
      <h2 className="mt-10 text-lg font-semibold text-gray-900">账号登录</h2>
      <p className="mt-2 text-sm text-gray-700">
        还没有账号?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          去注册
        </Link>{" "}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 grid grid-cols-1 gap-y-8"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="密码" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse text-xs">
            <Link
              href="/forget"
              className="text-sm text-blue-600 hover:underline"
            >
              忘记密码?
            </Link>
          </div>
          <Button type="submit" disabled={status === Status.Loading}>
            {status === Status.Loading && (
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
            )}
            登录
          </Button>
        </form>
      </Form>
    </SlimLayout>
  );
}
