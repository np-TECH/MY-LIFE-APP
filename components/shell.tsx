"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { LayoutDashboard, ListChecks, BriefcaseBusiness, CalendarRange, LogOut } from "lucide-react";

const nav = [
  { href: "/today", label: "Today", icon: ListChecks },
  { href: "/pipeline", label: "Pipeline", icon: BriefcaseBusiness },
  { href: "/planner", label: "Planner", icon: CalendarRange },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen text-white/90">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Njabulo OS</div>
            <div className="text-xl font-bold">Personal Operating System</div>
          </div>
          <div className="flex items-center gap-3">
            {email ? <div className="text-xs text-white/60">{email}</div> : null}
            <Button
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2"
              title="Sign out"
            >
              <LogOut size={16} /> Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
          <Card className="p-3 md:sticky md:top-6 md:h-[calc(100vh-72px)]">
            <div className="mb-2 text-xs font-semibold text-white/60">Navigation</div>
            <div className="space-y-1">
              {nav.map((n) => {
                const active = path.startsWith(n.href);
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition " +
                      (active ? "bg-accent text-white" : "hover:bg-white/5 text-white/80")
                    }
                  >
                    <Icon size={16} />
                    {n.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-semibold text-white/70">This week targets</div>
              <div className="mt-2 space-y-1 text-xs text-white/65">
                <div>Touchpoints: 25</div>
                <div>Meetings: 2</div>
                <div>Pitches: 1</div>
                <div>Gym: 4</div>
                <div>Date night: 1 (fortnightly)</div>
                <div>Family walk: 1</div>
              </div>
            </div>
          </Card>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
