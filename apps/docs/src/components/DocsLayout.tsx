import { Outlet } from "@tanstack/react-router";
import { DocsSidebar } from "./DocsSidebar";
import { Header } from "./Header";

export const DocsLayout = () => {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        <aside className="fixed left-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-border bg-background lg:block">
          <DocsSidebar />
        </aside>
        <main className="flex-1 lg:pl-64">
          <div className="px-6 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
