import type { ReactNode } from "react";
import { cn } from "@repo/ui/lib/utils";

type ProseProps = {
  children: ReactNode;
  className?: string;
};

export const Prose = ({ children, className }: ProseProps) => {
  return (
    <div
      className={cn(
        "max-w-none text-foreground",
        "[&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight",
        "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
        "[&_p]:mb-5 [&_p]:leading-7 [&_p]:text-muted-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:text-primary hover:[&_a]:underline hover:[&_a]:underline-offset-4",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li]:marker:text-primary",
        "[&_ul_li]:mb-2 [&_ul_li]:text-muted-foreground",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_ol_li]:mb-2 [&_ol_li]:text-muted-foreground",
        "[&_code]:rounded-md [&_code]:bg-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-primary",
        "[&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:border-l-2 [&_pre]:border-l-primary [&_pre]:bg-card [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground",
        "[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_hr]:my-8 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-border [&_hr]:to-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};
