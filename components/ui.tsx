import React from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/5 shadow-soft backdrop-blur p-4 transition hover:shadow-bloom " + className}>
      {children}
    </div>
  );
}

export function Button({
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base = "rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const styles =
    variant === "primary"
      ? "bg-accent-strong text-white hover:opacity-90"
      : variant === "danger"
      ? "bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/25"
      : "bg-white/5 border border-white/10 text-white/90 hover:bg-white/10";
  return <button className={base + " " + styles + " " + className} {...props} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20 " +
        (props.className ?? "")
      }
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20 " +
        (props.className ?? "")
      }
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-white/70">{children}</div>;
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">{children}</span>;
}

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "h-5 w-5 rounded-md border border-white/15 bg-white/5 transition " +
        (checked ? "bg-accent-strong border-white/25" : "hover:bg-white/10")
      }
      aria-checked={checked}
      role="checkbox"
    />
  );
}
