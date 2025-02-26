export interface MenuItem {
  title: string;
  href: string | null;
  children: { title: string; href: string }[];
}
