"use client";

import Shell from "@/components/shell";
import { Card, Checkbox, Input, Label, Textarea, Button } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DailyEntry } from "@/lib/types";
import { format } from "date-fns";
import { useRequireAuth } from "@/components/authGate";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TodayPage() {
  const { loading } = useRequireAuth();
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const dateStr = useMemo(() => todayISO(), []);
  const pretty = useMemo(() => format(new Date(dateStr), "EEEE, d MMM yyyy"), [dateStr]);

  async function loadOrCreate() {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", dateStr)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      setEntry(data as DailyEntry);
      return;
    }

    const { data: created, error: insErr } = await supabase
      .from("daily_entries")
      .insert({ user_id: user.id, entry_date: dateStr, notes: "" })
      .select("*")
      .single();

    if (insErr) throw insErr;
    setEntry(created as DailyEntry);
  }

  async function save() {
    if (!entry) return;
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("daily_entries")
      .update({
        outreach_done: entry.outreach_done,
        income_action_done: entry.income_action_done,
        future_build_done: entry.future_build_done,
        family_time_done: entry.family_time_done,
        gym_done: entry.gym_done,
        touchpoints_count: entry.touchpoints_count,
        meetings_count: entry.meetings_count,
        pitches_count: entry.pitches_count,
        notes: entry.notes ?? "",
      })
      .eq("id", entry.id);
    setSaving(false);
    setStatus(error ? error.message : "Saved ✓");
    setTimeout(() => setStatus(null), 2000);
  }

  useEffect(() => {
    if (loading) return;
    loadOrCreate().catch((e) => setStatus(e.message));
  }, [loading]);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0F17] text-white/80 flex items-center justify-center">Loading…</div>;
  }

  return (
    <Shell>
      <div className="space-y-4">
        <Card className="p-6 bg-accent border-white/10">
          <div className="text-xs text-white/70">Today</div>
          <div className="text-2xl font-bold">{pretty}</div>
          <div className="mt-2 text-sm text-white/70">
            Win the day with 3 outcomes: <span className="font-semibold">Income now</span>,{" "}
            <span className="font-semibold">Income later</span>, <span className="font-semibold">Family</span>.
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm font-bold">Daily checkboxes</div>
            <div className="mt-4 space-y-3">
              {[
                { key: "outreach_done", label: "Outreach done (create opportunity)" },
                { key: "income_action_done", label: "Income action taken (proposal/meeting/invoice)" },
                { key: "future_build_done", label: "Future build (IP, deck, concept progress)" },
                { key: "family_time_done", label: "Family time (wife/baby present)" },
                { key: "gym_done", label: "Gym / fitness completed" },
              ].map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <Checkbox
                    checked={Boolean((entry as any)?.[i.key])}
                    onChange={(v) => setEntry((prev) => (prev ? ({ ...prev, [i.key]: v } as any) : prev))}
                  />
                  <div className="text-sm text-white/80">{i.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold">Activity counts</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <Label>Touchpoints</Label>
                <Input
                  type="number"
                  value={entry?.touchpoints_count ?? 0}
                  onChange={(e) =>
                    setEntry((p) => (p ? { ...p, touchpoints_count: Number(e.target.value) } : p))
                  }
                />
              </div>
              <div>
                <Label>Meetings</Label>
                <Input
                  type="number"
                  value={entry?.meetings_count ?? 0}
                  onChange={(e) =>
                    setEntry((p) => (p ? { ...p, meetings_count: Number(e.target.value) } : p))
                  }
                />
              </div>
              <div>
                <Label>Pitches</Label>
                <Input
                  type="number"
                  value={entry?.pitches_count ?? 0}
                  onChange={(e) =>
                    setEntry((p) => (p ? { ...p, pitches_count: Number(e.target.value) } : p))
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Notes</Label>
              <Textarea
                rows={6}
                value={entry?.notes ?? ""}
                onChange={(e) => setEntry((p) => (p ? { ...p, notes: e.target.value } : p))}
                placeholder="Wins, blockers, next actions…"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={save} disabled={!entry || saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              {status ? <div className="text-xs text-white/60">{status}</div> : null}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
