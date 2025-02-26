import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu-custom";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Menus } from "@/data/menus";

export default function ShadcnMenu() {
  function renderMenu(menu: {
    title: string;
    href: string | null;
    children: { title: string; href: string }[];
  }) {
    if (menu.children.length) {
      return (
        <NavigationMenuItem key={menu.title}>
          <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
          <NavigationMenuContent asChild>
            <ul className="grid gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              {menu.children.map((child) => (
                <ListItem
                  key={child.title}
                  title={child.title}
                  href={child.href}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    } else if (menu.href) {
      return (
        <NavigationMenuItem key={menu.title}>
          <Link href={menu.href} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {menu.title}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      );
    }
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Menus.map((menu) => renderMenu(menu))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li key={title} className="w-[200px] lg:w-[300px]">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
