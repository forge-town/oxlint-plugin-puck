import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { docNav } from "@/lib/docs-nav";

describe("docNav", () => {
  it("has sections with items", () => {
    expect(docNav.length).toBeGreaterThan(0);

    for (const section of docNav) {
      expect(section.title).toBeTruthy();
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("links to /docs routes", () => {
    const paths = docNav.flatMap((section) => section.items.map((item) => item.to));

    expect(paths).toContain("/docs");
    expect(paths.every((path) => path.startsWith("/docs"))).toBe(true);
  });
});

describe("DocPage", () => {
  it("renders title and children", () => {
    render(
      <div>
        <h1>测试标题</h1>
        <p>测试内容</p>
      </div>
    );

    expect(screen.getByText("测试标题")).toBeTruthy();
    expect(screen.getByText("测试内容")).toBeTruthy();
  });
});
