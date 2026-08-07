import { Link, useLocation } from "@tanstack/react-router";
import { docNav } from "@/lib/docs-nav";
import { cn } from "@repo/ui/lib/utils";

export const DocsSidebar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col gap-6 p-4">
      {docNav.map((section) => (
        <div key={section.title}>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {section.title}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    className={cn(
                      "relative block rounded-md px-2 py-1.5 text-sm transition-colors",
                      "hover:bg-secondary hover:text-foreground",
                      isActive ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"
                    )}
                    to={item.to}
                  >
                    {isActive ? (
                      <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
                    ) : null}
                    <span className="pl-2">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
