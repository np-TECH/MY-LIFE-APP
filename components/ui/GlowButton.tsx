import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function GlowButton({ label, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`relative rounded-xl px-4 py-2 font-medium text-black sage-gradient bg-[length:200%_200%] animate-shimmer sage-cta ${className}`}
    >
      <span className="absolute inset-0 rounded-xl blur-xl opacity-25 sage-gradient" />
      <span className="relative">{label}</span>
    </button>
  );
}
