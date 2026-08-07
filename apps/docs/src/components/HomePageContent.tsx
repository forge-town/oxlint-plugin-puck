import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Zap, FileCode, BookOpen } from "lucide-react";
import { Button } from "@repo/ui/button";
import { GlowCard } from "./GlowCard";
import { HomeHeader } from "./HomeHeader";
import { PretextReveal } from "./PretextReveal";
import { Typewriter } from "./Typewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const terminalLines = [
  "$ bun add -D oxlint",
  "$ cp -r packages/rules/dist/plugins/* ./plugins/",
  "$ cat .oxlintrc.json",
  "{",
  '  "jsPlugins": ["./plugins/strict-method-module/strict-method-module.js"],',
  '  "rules": { "template-method/strict-method-module": "error" }',
  "}",
  "$ bunx oxlint --config .oxlintrc.json src/",
];

const features = [
  {
    title: "规则索引",
    description: "浏览全部 17 条自定义规则、用途与配置",
    to: "/docs",
    icon: Shield,
  },
  {
    title: "快速开始",
    description: "几分钟内把 Puck 规则接入你的项目",
    to: "/docs/getting-started",
    icon: Zap,
  },
  {
    title: "方法模块",
    description: "了解 *.method.ts 的命名与导出约束",
    to: "/docs/rules/strict-method-module",
    icon: FileCode,
  },
];

export const HomePageContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.registerPlugin(ScrollTrigger);

      const elements = heroRef.current?.querySelectorAll("[data-animate]") ?? [];

      gsap.fromTo(
        elements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        "#quick-start",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#quick-start",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        "#features",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#features",
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className="relative flex min-h-svh flex-col">
      <HomeHeader />
      <main className="flex-1">
        <section
          ref={heroRef}
          className="flex flex-col items-center justify-center px-6 pb-24 pt-20 text-center lg:pt-32"
        >
          <div
            data-animate
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary"
          >
            <Zap className="size-3" />
            Oxlint Plugin Puck · Custom Rules
          </div>
          <h1
            data-animate
            className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Lint rules that <span className="glow-text italic text-primary">ship</span> with your
            architecture.
          </h1>
          <p data-animate className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Oxlint Plugin Puck 是一套为 monorepo 前端项目设计的自定义规则集。
            它把组件、schema、store、method 与 JSX 事件处理的约定编码进 lint，
            让项目结构在代码提交前就被自动守护。
          </p>
          <div data-animate className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="bg-primary text-primary-foreground hover:shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_25%,transparent)]"
              render={<Link to="/docs" />}
            >
              Browse Rules
            </Button>
            <Button
              className="border-border text-foreground hover:bg-secondary hover:text-foreground"
              render={<Link to="/docs/getting-started" />}
              variant="outline"
            >
              Get Started
            </Button>
          </div>
        </section>

        <section id="intro" className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                What is this?
              </h2>
              <PretextReveal text="Oxlint Plugin Puck 不是通用规则库，而是一套和项目架构强绑定的自定义 Oxlint 规则。它把我们在 monorepo 中反复讨论的结构约定——组件文件只导出同名组件、schema 必须原子化、handler 必须放在 store、method 文件必须一文件一方法——变成可自动检查、自动修复的 lint 规则。" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">结构约束</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  原子组件、原子 schema、严格方法模块。
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">JSX 事件规范</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  on* 必须传 handle*，且动词后缀一致。
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileCode className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">Store 优先</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  handler 不进组件，useEffect 被禁用。
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">自动修复</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  部分规则支持 oxlint --fix 一键修复。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="quick-start" className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
            Quick Start
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-muted-foreground">bash</span>
            </div>
            <div className="p-4">
              <Typewriter lines={terminalLines} />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
            规则分类
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <GlowCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Oxlint Plugin Puck — built with TanStack Start, Tailwind CSS, GSAP and Pretext.
        </p>
      </footer>
    </div>
  );
};
