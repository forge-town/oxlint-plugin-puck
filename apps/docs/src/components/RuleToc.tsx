export type TocItem = {
  id: string;
  title: string;
  items?: TocItem[];
};

export const RuleToc = ({ items }: { items: TocItem[] }) => {
  return (
    <nav className="p-4">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
        <span className="h-px flex-1 bg-border" />
        On this page
        <span className="h-px flex-1 bg-border" />
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={`#${item.id}`}
            >
              {item.title}
            </a>
            {item.items && item.items.length > 0 ? (
              <ul className="mt-1.5 flex flex-col gap-1 border-l border-border pl-3">
                {item.items.map((sub) => (
                  <li key={sub.id}>
                    <a
                      className="block text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                      href={`#${sub.id}`}
                    >
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
};
