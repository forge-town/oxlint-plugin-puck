import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@repo/ui/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TypewriterProps = {
  lines: string[];
  className?: string;
};

export const Typewriter = ({ lines, className }: TypewriterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      const lineEls = gsap.utils.toArray<HTMLElement>(
        containerRef.current?.querySelectorAll("[data-type-line]") ?? []
      );

      const timeline = gsap.timeline();

      lineEls.forEach((el) => {
        const text = el.dataset.text ?? "";
        const progress = { value: 0 };

        timeline.set(el, { opacity: 1 });
        timeline.to(progress, {
          value: text.length,
          duration: Math.max(0.4, text.length * 0.015),
          ease: "none",
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(progress.value));
          },
        });
        timeline.to({}, { duration: 0.3 });
      });
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={containerRef} className={cn("font-mono text-sm", className)}>
      {lines.map((line, index) => (
        <div
          key={index}
          data-type-line
          data-text={line}
          className={reducedMotion ? "opacity-100" : "opacity-0"}
        >
          {reducedMotion ? line : ""}
        </div>
      ))}
      <span className="cursor-blink mt-1 inline-block h-4 w-2 translate-y-0.5 bg-primary" />
    </div>
  );
};
