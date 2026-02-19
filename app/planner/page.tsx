"use client";

import Shell from "@/components/shell";
import { Card, Button, Checkbox, Input, Label, Textarea } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { WeeklyReview } from "@/lib/types";
import { useRequireAuth } from "@/components/authGate";
import { startOfWeek, format } from "date-fns";
import { weeklyScorePct } from "@/lib/scoring";

function weekStartISO(d: Date) {
  const ws = startOfWeek(d, { weekStartsOn: 1 });
  return ws.toISOString().slice(0, 10);
}

export default function PlannerPage() {
  const { loading } = useRequireAuth();
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const ws = useMemo(() => weekStartISO(new Date()), []);
  const pretty = useMemo(() => format(new Date(ws), "'Week of' d MMM yyyy"), [ws]);

  async function loadOrCreate() {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("week_start", ws)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      setReview(data as WeeklyReview);
      return;
    }

    const { data: created, error: insErr } = await supabase
      .from("weekly_reviews")
      .insert({
        user_id: user.id,
        week_start: ws,
        touchpoints: 0,
        meetings: 0,
        pitches: 0,
        gym_sessions: 0,
        date_night: false,
        family_walk: false,
        notes: "",
      })
      .select("*")
      .single();

    if (insErr) throw insErr;
    setReview(created as WeeklyReview);
  }

  async function save() {
    if (!review) return;
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("weekly_reviews")
      .update({
        touchpoints: review.touchpoints,
        meetings: review.meetings,
        pitches: review.pitches,
        gym_sessions: review.gym_sessions,
        date_night: review.date_night,
        family_walk: review.family_walk,
        notes: review.notes ?? "",
      })
      .eq("id", review.id);
    setSaving(false);
    setStatus(error ? error.message : "Saved ✓");
    setTimeout(() => setStatus(null), 2000);
  }

  useEffect(() => {
    if (loading) return;
    loadOrCreate().catch((e) => setStatus(e.message));
  }, [loading]);

  const score = useMemo(() => {
    if (!review) return 0;
    return weeklyScorePct({
      touchpoints: review.touchpoints ?? 0,
      meetings: review.meetings ?? 0,
      pitches: review.pitches ?? 0,
      gym: review.gym_sessions ?? 0,
      dateNight: review.date_night ? 1 : 0,
      familyWalk: review.family_walk ? 1 : 0,
    });
  }, [review]);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0F17] text-white/80 flex items-center justify-center">Loading…</div>;
  }

  return (
    <Shell>
      <div className="space-y-4">
        <Card className="p-6 bg-accent border-white/10">
          <div className="text-xs text-white/70">Planner</div>
          <div className="text-2xl font-bold">{pretty}</div>
          <div className="mt-2 text-sm text-white/70">Weekly score updates your dashboard. Keep it honest.</div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Weekly targets</div>
                <div className="mt-1 text-xs text-white/60">Touchpoints 25 · Meetings 2 · Pitches 1 · Gym 4</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <div className="text-xs text-white/60">Score</div>
                <div className="text-2xl font-bold">{score}%</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <Label>Touchpoints</Label>
                <Input type="number" value={review?.touchpoints ?? 0} onChange={(e) => setReview((p) => (p ? { ...p, touchpoints: Number(e.target.value) } : p))} />
              </div>
              <div>
                <Label>Meetings</Label>
                <Input type="number" value={review?.meetings ?? 0} onChange={(e) => setReview((p) => (p ? { ...p, meetings: Number(e.target.value) } : p))} />
              </div>
              <div>
                <Label>Pitches</Label>
                <Input type="number" value={review?.pitches ?? 0} onChange={(e) => setReview((p) => (p ? { ...p, pitches: Number(e.target.value) } : p))} />
              </div>
              <div>
                <Label>Gym sessions</Label>
                <Input type="number" value={review?.gym_sessions ?? 0} onChange={(e) => setReview((p) => (p ? { ...p, gym_sessions: Number(e.target.value) } : p))} />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox checked={Boolean(review?.date_night)} onChange={(v) => setReview((p) => (p ? { ...p, date_night: v } : p))} />
                <div className="text-sm text-white/80">Date night completed (fortnightly)</div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={Boolean(review?.family_walk)} onChange={(v) => setReview((p) => (p ? { ...p, family_walk: v } : p))} />
                <div className="text-sm text-white/80">Family walk completed</div>
              </div>
            </div>

            <div className="mt-4">
              <Label>Weekly notes</Label>
              <Textarea rows={5} value={review?.notes ?? ""} onChange={(e) => setReview((p) => (p ? { ...p, notes: e.target.value } : p))} placeholder="What worked, what failed, next week fixes…" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={save} disabled={saving || !review}>
                {saving ? "Saving…" : "Save weekly review"}
              </Button>
              {status ? <div className="text-xs text-white/60">{status}</div> : null}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold">Weekly life anchors</div>
            <div className="mt-3 space-y-2 text-sm text-white/75">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Monday</div>
                <div className="text-xs text-white/60">Indoor football 19:00–20:00</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Thursday</div>
                <div className="text-xs text-white/60">Gym with wife 10:00</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Saturday</div>
                <div className="text-xs text-white/60">Family walk (baby + dogs)</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Every 2 weeks</div>
                <div className="text-xs text-white/60">Date night</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Gym</div>
                <div className="text-xs text-white/60">4× weekly minimum (incl Thu + Sun recovery)</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
