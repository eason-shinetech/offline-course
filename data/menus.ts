import { MenuItem } from "@/models";

export const Menus: MenuItem[] = [
  {
    title: "游戏开发",
    href: null,
    children: [
      { title: "Unreal Engine", href: "/game/unreal" },
      { title: "Unity3D", href: "/game/unity" },
      { title: "Godot", href: "/game/godot" },
      { title: "Blender", href: "/game/blender" },
      { title: "Other", href: "/game/other" },
    ],
  },
  {
    title: "Web开发",
    href: null,
    children: [
      { title: "React", href: "/web/react" },
      { title: "Vue", href: "/web/vue" },
      { title: "Angular", href: "/web/angular" },
      { title: "Nextjs", href: "/web/nextjs" },
      { title: "Tailwindcss", href: "/web/tailwindcss" },
      { title: "Other", href: "/web/other" },
    ],
  },
  {
    title: "运维",
    href: "/operation",
    children: [],
  },
  {
    title: "AI",
    href: "/ai",
    children: [],
  },
  {
    title: "资源求助",
    href: "/help",
    children: [],
  },
];
