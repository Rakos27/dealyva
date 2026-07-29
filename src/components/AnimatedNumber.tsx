import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const [displayedValue, setDisplayedValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? Math.max(0, value) : 0;
    const start = previousValue.current;
    previousValue.current = target;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() =>
        setDisplayedValue(target),
      );
      return () => window.cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const duration = 650;
    let frame = 0;

    const update = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedValue(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(update);
      }
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span
      className="animated-number"
      aria-label={`${prefix}${Math.max(0, value)}${suffix}`}
    >
      <span aria-hidden="true">
        {prefix}
        {displayedValue}
        {suffix}
      </span>
    </span>
  );
}
