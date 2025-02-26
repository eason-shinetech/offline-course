"use client";
import Link from "next/link";
import Image from "next/image";
import { SlimLayout } from "@/components/web-layout/SlimLayout";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { LoginResult, registerFormSchema, Status, UserRole } from "@/models";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import post from "@/lib/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import SliderVerify from "@/components/slider-verify/SliderVerify";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [status, setStatus] = useState(Status.Idle);
  const [isSendCode, setIsSendCode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const verifyRef = useRef<SliderVerify>(null);

  async function onVerifySuccess(value: any) {
    const email = value.email?.toString();
    if (!email) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "邮箱不能为空",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      verifyRef.current?.reset();
      return;
    }
    //send email
    const response = await post(
      "auth/sendRegisterCode",
      { email: email },
      false
    );
    console.log(response);
    if (!response.ok) {
      //show a toast
      toast({
        variant: "destructive",
        title: "发送验证码失败",
        description: "验证码发送失败，请稍后重试",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      verifyRef.current?.reset();
      return;
    } else {
      setIsSendCode(true);
      toast({
        variant: "success",
        title: "发送验证码成功",
        description: "请及时查看您的邮箱，输入对应的验证码即可注册！",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
    }
  }

  function checkEmailDirty(emailState: any) {
    if (!emailState) return true;
    if (!emailState.invalid && emailState.isTouched) return false;
    return true;
  }

  // 初始化表单
  const form = useForm<z.infer<typeof registerFormSchema>>({
    // 指定表单验证规则
    resolver: zodResolver(registerFormSchema),
    // 验证模式，onChange表示输入框值变化时触发验证
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      code: "",
    },
  });

  // 提交表单
  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setStatus(Status.Loading);
    const response = await post(
      "auth/register",
      { ...values, role: UserRole.USER },
      false
    );
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
    <SlimLayout isLogin={false}>
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
      <h2 className="mt-10 text-lg font-semibold text-gray-900">免费注册</h2>
      <p className="mt-2 text-sm text-gray-700">
        已经注册?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          去登录
        </Link>{" "}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="邮箱" {...field} />
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
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="确认密码" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SliderVerify
            ref={verifyRef}
            success={() => onVerifySuccess(form.getValues())}
            disabled={checkEmailDirty(form.getFieldState("email"))}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="输入验证码"
                    disabled={!isSendCode}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={status === Status.Loading}>
            {status === Status.Loading && (
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
            )}
            注册
          </Button>
        </form>
      </Form>
    </SlimLayout>
  );
}
