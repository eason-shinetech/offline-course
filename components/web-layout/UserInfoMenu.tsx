"use client";
import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import post from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function UserInfoMenu({ user, logout }: any) {
  const { toast } = useToast();

  async function logOut() {
    const userString = localStorage.getItem("user");
    if (!userString) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return;
    }
    const user = JSON.parse(userString);
    const response = await post("auth/logout", { _id: user._id }, false);
    if (response.ok) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout();
    } else {
      const data = await response.json();
      toast({
        variant: "destructive",
        title: "登出失败",
        description: data.message,
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
    }
  }

  return (
    <div className="hidden md:block rounded-full p-2 cursor-pointer hover:bg-slate-100">
      <HoverCard openDelay={100}>
        <HoverCardTrigger>
          <Avatar>
            <AvatarImage
              src="/images/user.png"
              alt="user-avatar"
              className="h-6 w-auto"
            />
            <AvatarFallback>{user.userName}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent>
          <ul className="text-sm">
            <li className="p-2 border-b">
              <div>
                <div>{user.userName}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </li>
            <li className="p-2 border-b">
              <Link href="/profile">账号信息</Link>
            </li>
            <li className="p-2 border-b">
              <Link href="/profile">我的收藏</Link>
            </li>
            <li className="p-2 border-b">
              <Link href="/profile">我的下载</Link>
            </li>
            <li className="p-2 border-b" onClick={logOut}>
              退出登录
            </li>
          </ul>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
