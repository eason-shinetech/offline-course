"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/web-layout/Container";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { AiOutlineSearch, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import ShadcnMenu from "./ShadcnMenu";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";
import useNextLocalStorage from "@/data/nextLocalStorage";
import UserInfoMenu from "./UserInfoMenu";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const local = localStorage.getItem("user");
    const userData = local ? JSON.parse(local) : null;
    setUser(userData);
  }, []);

  useNextLocalStorage("user", (newUser) => setUser(newUser));

  function logout() {
    setUser(null);
  }

  return (
    <header className="w-full">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <Image
                src="/images/logo.png"
                alt="logo"
                className="h-10 w-auto"
                width={60}
                height={60}
              />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <ShadcnMenu />
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-6">
            <div className="hidden md:block rounded-full p-2 cursor-pointer hover:bg-slate-100">
              <AiOutlineSearch className="h-6 w-auto" />
            </div>
            <div
              className="hidden md:block rounded-full p-2 cursor-pointer hover:bg-slate-100"
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? (
                <AiOutlineMoon className="h-6 w-auto" />
              ) : (
                <AiOutlineSun className="h-6 w-auto" />
              )}
            </div>
            {user ? (
              <UserInfoMenu user={user} logout={logout} />
            ) : (
              <Button className="hidden md:block" asChild>
                <Link href="/login">登录</Link>
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              <MobileMenu />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
