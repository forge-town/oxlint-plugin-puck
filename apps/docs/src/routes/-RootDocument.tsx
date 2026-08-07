import { Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { Surface } from "@/components/Surface";

export const RootDocument = () => {
  return (
    <html className="dark" lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        <Surface>
          <Outlet />
        </Surface>
        <Scripts />
      </body>
    </html>
  );
};
