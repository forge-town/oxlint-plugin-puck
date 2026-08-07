import { createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { NotFound } from "./-NotFound";
import { RootDocument } from "./-RootDocument";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Puck Docs" },
      {
        name: "description",
        content: "Custom Oxlint rules for monorepo frontend projects.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});
