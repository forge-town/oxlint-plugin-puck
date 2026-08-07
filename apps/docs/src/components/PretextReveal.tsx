import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@repo/ui/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type PretextRevealProps = {
  text: string;
  className?: string;
};

export const PretextReveal = ({ text, className }: PretextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const measure = async () => {
      const container = containerRef.current;
      if (!container) return;

      const { prepareWithSegments, layoutWithLines } = await import("@chenglou/pretext");
      await document.fonts.ready;

      const width = container.clientWidth;
      const styles = window.getComputedStyle(container);
      const font = styles.font;
      const lineHeight = Number.parseFloat(styles.lineHeight) || 24;

      const prepared = prepareWithSegments(text, font, {
        whiteSpace: "normal",
      });
      const result = layoutWithLines(prepared, width, lineHeight);
      setLines(result.lines.map((line) => line.text));
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });

    const container = containerRef.current;
    if (container) observer.observe(container);

    return () => observer.disconnect();
  }, [text]);

  useGSAP(
    () => {
      if (reducedMotion || lines.length === 0) return;

      gsap.fromTo(
        containerRef.current?.children ?? [],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef, dependencies: [lines, reducedMotion] }
  );

  if (reducedMotion) {
    return (
      <p
        ref={containerRef}
        className={cn("text-lg leading-relaxed text-muted-foreground", className)}
      >
        {text}
      </p>
    );
  }

  return (
    <div ref={containerRef} className={cn("space-y-1", className)}>
      {lines.length === 0 ? (
        <p className="text-lg leading-relaxed text-muted-foreground">{text}</p>
      ) : (
        lines.map((line, index) => (
          <div key={index} className="text-lg leading-relaxed text-muted-foreground">
            {line}
          </div>
        ))
      )}
    </div>
  );
};
