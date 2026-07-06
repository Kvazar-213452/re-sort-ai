"use client";

import { useEffect, useRef, useState } from "react";

export function ProgressBar({
  value,
  className = "",
  barClassName = "bg-accent",
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(value);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className={`h-full rounded-full ${barClassName} transition-[width] duration-[1200ms] ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}