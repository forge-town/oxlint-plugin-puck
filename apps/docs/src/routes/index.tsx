import { createFileRoute } from "@tanstack/react-router";
import { HomePageContent } from "@/components/HomePageContent";

export const Route = createFileRoute("/")({
  component: HomePageContent,
});
