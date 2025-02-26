"use client";
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
import { forgetFormSchema, resetPasswordFormSchema, Status } from "@/models";
import SliderVerify from "@/components/slider-verify/SliderVerify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import post from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ForgetPasswordPage() {
  const [status, setStatus] = useState(Status.Idle);
  const { toast } = useToast();
  const router = useRouter();
  const [isSendCode, setIsSendCode] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const verifyRef = useRef<SliderVerify>(null);

  async function onVerifySuccess(value: any) {
    const userName = value.userName?.toString();
    if (!userName) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "用户名或邮箱不能为空",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      verifyRef.current?.reset();
      return;
    }
    //send email
    const response = await post(
      "auth/sendForgetCode",
      { userName: userName },
      false
    );
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

  function checkDataDirty(userNameState: any) {
    if (!userNameState) return true;
    if (!userNameState.invalid && userNameState.isTouched) return false;
    return true;
  }

  // 初始化表单
  const forgerForm = useForm<z.infer<typeof forgetFormSchema>>({
    // 指定表单验证规则
    resolver: zodResolver(forgetFormSchema),
    // 验证模式，onChange表示输入框值变化时触发验证
    mode: "onChange",
    defaultValues: {
      userName: "",
      code: "",
    },
  });

  /**
   * 校验验证码，成功后才能开始修改密码
   * @param values
   */
  async function onForgetFormSubmit(values: z.infer<typeof forgetFormSchema>) {
    setStatus(Status.Loading);
    const response = await post("auth/checkForgetCode", values, false);
    const data = await response.json();
    if (!response.ok) {
      setStatus(Status.Error);
      //show a toast
      toast({
        variant: "destructive",
        title: "校验验证码失败",
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      return;
    } else {
      setStatus(Status.Success);
      setIsVerify(true);

      resetForm.reset({
        userName: values.userName,
        password: "",
      });

      toast({
        variant: "success",
        title: "校验验证码成功",
        description: "请及时查看您的邮箱，输入对应的验证码！",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
    }
  }

  // 初始化表单
  const resetForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    // 指定表单验证规则
    resolver: zodResolver(resetPasswordFormSchema),
    // 验证模式，onChange表示输入框值变化时触发验证
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  /**
   * 修改密码
   * @param values
   */
  async function onResetFormSubmit(
    values: z.infer<typeof resetPasswordFormSchema>
  ) {
    setStatus(Status.Loading);
    const response = await post("auth/changePassword", values, false);
    const data = await response.json();
    if (!response.ok) {
      setStatus(Status.Error);
      //show a toast
      toast({
        variant: "destructive",
        title: "修改密码失败",
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
      return;
    } else {
      setStatus(Status.Success);
      router.push("/login");
    }
  }

  return (
    <>
      <div
        className={
          isVerify
            ? "hidden"
            : "w-full h-[100vh] flex items-center justify-center"
        }
      >
        <Form {...forgerForm}>
          <form
            id="forgerForm"
            onSubmit={forgerForm.handleSubmit(onForgetFormSubmit)}
            className="w-full md:w-[600px] p-4 grid grid-cols-1 gap-x-6 gap-y-8"
          >
            <FormField
              control={forgerForm.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="用户名/邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SliderVerify
              ref={verifyRef}
              success={() => onVerifySuccess(forgerForm.getValues())}
              disabled={checkDataDirty(forgerForm.getFieldState("userName"))}
            />
            <FormField
              control={forgerForm.control}
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
            <Button
              type="submit"
              disabled={status === Status.Loading || !isSendCode}
            >
              {status === Status.Loading && (
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              )}
              下一步
            </Button>
          </form>
        </Form>
      </div>
      <div
        className={
          isVerify
            ? "w-full h-[100vh] flex items-center justify-center"
            : "hidden"
        }
      >
        <Form {...resetForm}>
          <form
            id="resetForm"
            onSubmit={resetForm.handleSubmit(onResetFormSubmit)}
            className="w-full md:w-[600px] p-4 grid grid-cols-1 gap-x-6 gap-y-8"
          >
            <FormField
              control={resetForm.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="用户名" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="新密码" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="确认新密码"
                      type="password"
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
              提交
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
