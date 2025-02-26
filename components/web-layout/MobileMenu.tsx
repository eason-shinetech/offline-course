import { AiOutlineBars, AiOutlineClose } from "react-icons/ai";
import { Menus } from "@/data/menus";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { MenuItem } from "@/models";
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const loginMenu: MenuItem = { title: "登录", href: "/login", children: [] };
  function showMenu() {
    setIsOpen(!isOpen);
  }

  function selectMenu(menu: MenuItem) {
    if (menu.title === activeMenu) {
      setActiveMenu("");
      return;
    }
    setActiveMenu(menu.title);
  }

  function renderMenu(menu: MenuItem) {
    if (menu.href) {
      return (
        <Link href={menu.href}>
          <li
            className="p-4 cursor-pointer rounded-lg hover:bg-slate-300"
            key={menu.title}
          >
            {menu.title}
          </li>
        </Link>
      );
    } else if (menu.children.length) {
      return (
        <>
          <li
            className="p-4 cursor-pointer rounded-lg hover:bg-slate-300"
            key={menu.title}
            onClick={() => selectMenu(menu)}
          >
            <span>{menu.title}</span>
          </li>
          {activeMenu === menu.title && (
            <ul className="">
              {menu.children.map((child) => (
                <Link key={child.title} href={child.href}>
                  <li className="p-4 text-sm rounded-lg text-zinc-500 hover:bg-slate-200">
                    {child.title}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </>
      );
    }
  }
  return (
    <>
      <div className="relative">
        <Button variant="outline" size="icon" onClick={showMenu}>
          {isOpen ? <AiOutlineClose /> : <AiOutlineBars />}
        </Button>
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full text-center flex flex-col items-center justify-center w-full bg-slate-100 rounded-lg mt-2">
          <ul className="w-full">
            {Menus.map((menu) => renderMenu(menu))}
            {loginMenu && renderMenu(loginMenu)}
          </ul>
        </div>
      )}
    </>
  );
}
