import { useRef, type JSX } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@repo/ui/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type AnimatedTextProps = {
  text: string;
  as?: "h1" | "h2" | "span" | "p";
  className?: string;
  charClassName?: string;
  delay?: number;
};

export const AnimatedText = ({
  text,
  as: Component = "span",
  className,
  charClassName,
  delay = 0,
}: AnimatedTextProps): JSX.Element => {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const chars = containerRef.current?.querySelectorAll(".char");
      if (!chars || chars.length === 0) return;

      gsap.fromTo(
        chars,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          stagger: 0.03,
          ease: "back.out(1.7)",
        }
      );
    },
    { scope: containerRef, dependencies: [delay, reducedMotion] }
  );

  if (reducedMotion) {
    return <Component className={cn(className)}>{text}</Component>;
  }

  const chars = [...text].map((char, index) => (
    <span
      key={`${char}-${index}`}
      className={cn("char inline-block will-change-transform", charClassName)}
      style={{ opacity: 0 }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  if (Component === "h1") {
    return (
      <h1 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={cn(className)}>
        {chars}
      </h1>
    );
  }
  if (Component === "h2") {
    return (
      <h2 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={cn(className)}>
        {chars}
      </h2>
    );
  }
  if (Component === "p") {
    return (
      <p ref={containerRef as React.RefObject<HTMLParagraphElement>} className={cn(className)}>
        {chars}
      </p>
    );
  }
  return (
    <span ref={containerRef as React.RefObject<HTMLSpanElement>} className={cn(className)}>
      {chars}
    </span>
  );
};
