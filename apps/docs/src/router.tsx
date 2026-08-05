import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

export const getRouter = () => router;
