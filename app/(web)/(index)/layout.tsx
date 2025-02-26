import Header from "@/components/web-layout/Header";

export default function IndexLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen p-10 bg-background text-foreground">
      <Header />
      {children}
    </div>
  );
}
