"use client";

import Shell from "@/components/shell";
import { Chip } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DailyEntry, PipelineItem, WeeklyReview } from "@/lib/types";
import { useRequireAuth } from "@/components/authGate";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { weeklyScorePct } from "@/lib/scoring";
import { GlassCard } from "@/components/ui/GlassCard";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { loading } = useRequireAuth();
  const [daily, setDaily] = useState<DailyEntry[]>([]);
  const [weekly, setWeekly] = useState<WeeklyReview[]>([]);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);

  async function loadAll() {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    const [d1, w1, p1] = await Promise.all([
      supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: true }),
      supabase
        .from("weekly_reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("week_start", { ascending: true }),
      supabase.from("pipeline_items").select("*").eq("user_id", user.id),
    ]);

    setDaily((d1.data ?? []) as DailyEntry[]);
    setWeekly((w1.data ?? []) as WeeklyReview[]);
    setPipeline((p1.data ?? []) as PipelineItem[]);
  }

  useEffect(() => {
    if (loading) return;
    loadAll().catch(console.error);
  }, [loading]);

  const weekInterval = useMemo(() => {
    const s = startOfWeek(new Date(), { weekStartsOn: 1 });
    const e = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { s, e };
  }, []);

  const thisWeekDaily = useMemo(() => {
    return daily.filter((d) => {
      const dt = new Date(d.entry_date);
      return isWithinInterval(dt, { start: weekInterval.s, end: weekInterval.e });
    });
  }, [daily, weekInterval]);

  const kpis = useMemo(() => {
    const touch = thisWeekDaily.reduce((a, x) => a + (x.touchpoints_count ?? 0), 0);
    const meet = thisWeekDaily.reduce((a, x) => a + (x.meetings_count ?? 0), 0);
    const pitch = thisWeekDaily.reduce((a, x) => a + (x.pitches_count ?? 0), 0);
    const gym = thisWeekDaily.reduce((a, x) => a + (x.gym_done ? 1 : 0), 0);

    const ws = iso(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const wr = weekly.find((w) => w.week_start === ws);
    const score = weeklyScorePct({
      touchpoints: wr?.touchpoints ?? touch,
      meetings: wr?.meetings ?? meet,
      pitches: wr?.pitches ?? pitch,
      gym: wr?.gym_sessions ?? gym,
      dateNight: wr?.date_night ? 1 : 0,
      familyWalk: wr?.family_walk ? 1 : 0,
    });

    return { touch, meet, pitch, score };
  }, [thisWeekDaily, weekly]);

  const weeklyTrend = useMemo(() => {
    if (!weekly.length) return [];
    return weekly.map((w) => ({
      week: w.week_start.slice(5),
      score: weeklyScorePct({
        touchpoints: w.touchpoints ?? 0,
        meetings: w.meetings ?? 0,
        pitches: w.pitches ?? 0,
        gym: w.gym_sessions ?? 0,
        dateNight: w.date_night ? 1 : 0,
        familyWalk: w.family_walk ? 1 : 0,
      }),
    }));
  }, [weekly]);

  const pipelineByStage = useMemo(() => {
    const stages = ["Sent", "Responded", "Meeting", "Pitch", "Closed"];
    return stages.map((s) => ({
      stage: s,
      value: pipeline
        .filter((p) => p.stage === s)
        .reduce((a, x) => a + Number(x.value_potential ?? 0), 0),
    }));
  }, [pipeline]);

  return (
    <Shell>
      <div className="space-y-4">
        {/* HERO */}
        <GlassCard className="p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs text-white/70">Dashboard</div>
              <div className="text-2xl font-bold">Your momentum, measured</div>
              <div className="mt-2 text-sm text-white/70">
                This stays honest because it’s fed by your daily actions.
              </div>
            </div>
           <Chip>Week score: {kpis.score}%</Chip>
          </div>
        </GlassCard>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <GlassCard className="p-5">
            <div className="text-xs text-white/60">Touchpoints (this week)</div>
            <div className="mt-1 text-3xl font-bold">{kpis.touch}</div>
            <div className="mt-2 text-xs text-white/50">Target: 25</div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-xs text-white/60">Meetings (this week)</div>
            <div className="mt-1 text-3xl font-bold">{kpis.meet}</div>
            <div className="mt-2 text-xs text-white/50">Target: 2</div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-xs text-white/60">Pitches (this week)</div>
            <div className="mt-1 text-3xl font-bold">{kpis.pitch}</div>
            <div className="mt-2 text-xs text-white/50">Target: 1</div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-xs text-white/60">Weekly score</div>
            <div className="mt-1 text-3xl font-bold">{kpis.score}%</div>
            <div className="mt-2 text-xs text-white/50">Aim: 75%+</div>
          </GlassCard>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard className="p-5">
            <div className="text-sm font-bold">Weekly score trend</div>
            <div className="mt-4 h-[260px]">
              {weeklyTrend.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.45)" />
                    <YAxis stroke="rgba(255,255,255,0.45)" />
                    <Tooltip
                      contentStyle={{
                        background: "#0B0F17",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="rgba(16,185,129,0.85)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-white/60">
                  No weekly reviews yet. Update Planner to populate this chart.
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-sm font-bold">Pipeline value by stage</div>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineByStage}>
                  <XAxis dataKey="stage" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip
                    contentStyle={{
                      background: "#0B0F17",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                  <Bar dataKey="value" fill="rgba(16,185,129,0.55)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-white/55">
              Set realistic value potentials so this reflects your true pipeline.
            </div>
          </GlassCard>
        </div>
      </div>
    </Shell>
  );
}
