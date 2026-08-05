import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/sidebar";
import { docNav } from "@/lib/docs-nav";

export const DocsSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar className="border-0!">
      <SidebarHeader>
        <Link className="flex items-center gap-2 px-2 py-2" to="/">
          <BookOpen className="size-5" />
          <span className="text-lg font-bold">Docs</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {docNav.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={pathname === item.to}
                      render={<Link to={item.to} />}
                    >
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
