import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/sidebar";
import { DocsSidebar } from "./DocsSidebar";

export const DocsLayout = () => {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
