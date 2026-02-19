import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl glass-card glass-card-hover ${className}`}
    >
      {children}
    </div>
  );
}
