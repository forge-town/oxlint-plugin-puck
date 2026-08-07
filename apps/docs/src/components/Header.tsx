import { DocsBreadcrumb } from "./DocsBreadcrumb";

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
      <DocsBreadcrumb />
    </header>
  );
};
