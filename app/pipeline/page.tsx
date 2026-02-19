"use client";

import Shell from "@/components/shell";
import { Card, Button, Input, Label, Textarea, Chip } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { PipelineItem } from "@/lib/types";
import { useRequireAuth } from "@/components/authGate";
import { format } from "date-fns";

const STAGES = ["Sent", "Responded", "Meeting", "Pitch", "Closed"] as const;

export default function PipelinePage() {
  const { loading } = useRequireAuth();
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    category: "Agency",
    channel: "WhatsApp",
    stage: "Sent",
    follow_up_date: "",
    value_potential: "0",
    next_action: "",
    notes: "",
  });

  async function load() {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("pipeline_items")
      .select("*")
      .eq("user_id", user.id)
      .order("follow_up_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    setItems((data ?? []) as PipelineItem[]);
  }

  useEffect(() => {
    if (loading) return;
    load().catch(console.error);
  }, [loading]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchStage = stageFilter === "All" ? true : it.stage === stageFilter;
      const hay = `${it.contact_name} ${it.company ?? ""} ${it.category ?? ""} ${it.next_action ?? ""}`.toLowerCase();
      const matchQ = q.trim() ? hay.includes(q.toLowerCase()) : true;
      return matchStage && matchQ;
    });
  }, [items, stageFilter, q]);

  async function createItem() {
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) return;

    if (!form.contact_name.trim()) return;

    setCreating(true);
    const { error } = await supabase.from("pipeline_items").insert({
      user_id: user.id,
      contact_name: form.contact_name,
      company: form.company || null,
      category: form.category || null,
      channel: form.channel || null,
      stage: form.stage,
      date_contacted: new Date().toISOString().slice(0, 10),
      follow_up_date: form.follow_up_date || null,
      value_potential: Number(form.value_potential || 0),
      next_action: form.next_action || null,
      notes: form.notes || null,
    });
    setCreating(false);
    if (!error) {
      setForm({
        contact_name: "",
        company: "",
        category: "Agency",
        channel: "WhatsApp",
        stage: "Sent",
        follow_up_date: "",
        value_potential: "0",
        next_action: "",
        notes: "",
      });
      await load();
    }
  }

  async function setStage(id: string, stage: string) {
    await supabase.from("pipeline_items").update({ stage }).eq("id", id);
    await load();
  }

  async function remove(id: string) {
    await supabase.from("pipeline_items").delete().eq("id", id);
    await load();
  }

  const dueToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return items.filter((i) => i.follow_up_date === today && i.stage !== "Closed").length;
  }, [items]);

  return (
    <Shell>
      <div className="space-y-4">
        <Card className="p-6 bg-accent border-white/10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs text-white/70">Pipeline</div>
              <div className="text-2xl font-bold">Chase List + Follow-ups</div>
              <div className="mt-2 text-sm text-white/70">
                Keep every contact alive with a next action and follow-up date.
                {dueToday ? <span className="ml-2 font-semibold text-white">Due today: {dueToday}</span> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip>{filtered.length} items</Chip>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          <Card className="p-5">
            <div className="text-sm font-bold">Add pipeline item</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Contact name</Label>
                <Input value={form.contact_name} onChange={(e) => setForm((p) => ({ ...p, contact_name: e.target.value }))} placeholder="Name" />
              </div>
              <div className="col-span-2">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Agency / Broadcaster / ProdCo…" />
              </div>
              <div>
                <Label>Channel</Label>
                <Input value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} placeholder="WhatsApp / Email / LinkedIn" />
              </div>
              <div>
                <Label>Stage</Label>
                <Input value={form.stage} onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))} placeholder="Sent" />
              </div>
              <div>
                <Label>Follow-up date</Label>
                <Input type="date" value={form.follow_up_date} onChange={(e) => setForm((p) => ({ ...p, follow_up_date: e.target.value }))} />
              </div>
              <div>
                <Label>Value potential (R)</Label>
                <Input type="number" value={form.value_potential} onChange={(e) => setForm((p) => ({ ...p, value_potential: e.target.value }))} />
              </div>
              <div>
                <Label>Next action</Label>
                <Input value={form.next_action} onChange={(e) => setForm((p) => ({ ...p, next_action: e.target.value }))} placeholder="Coffee / call / send deck…" />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Context, relationship notes…" />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={createItem} disabled={creating || !form.contact_name.trim()} className="w-full">
                {creating ? "Adding…" : "Add item"}
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <Label>Search</Label>
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, company, next action…" />
                </div>
                <div className="min-w-[160px]">
                  <Label>Stage filter</Label>
                  <div className="flex gap-2 flex-wrap">
                    {["All", ...STAGES].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStageFilter(s)}
                        className={
                          "rounded-xl px-3 py-2 text-xs border transition " +
                          (stageFilter === s ? "bg-accent border-white/15" : "bg-white/5 border-white/10 hover:bg-white/10")
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              {filtered.map((it) => (
                <Card key={it.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">{it.contact_name}</div>
                      <div className="text-xs text-white/60">
                        {(it.company ?? "—")} · {(it.category ?? "—")} · {(it.channel ?? "—")}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <Chip>Stage: {it.stage}</Chip>
                        <Chip>Value: R{Math.round(Number(it.value_potential ?? 0)).toLocaleString()}</Chip>
                        {it.follow_up_date ? (
                          <Chip>Follow-up: {format(new Date(it.follow_up_date), "d MMM")}</Chip>
                        ) : (
                          <Chip>No follow-up set</Chip>
                        )}
                      </div>
                      {it.next_action ? (
                        <div className="mt-2 text-sm text-white/75">
                          <span className="text-white/55">Next:</span> {it.next_action}
                        </div>
                      ) : null}
                      {it.notes ? <div className="mt-2 text-xs text-white/55">{it.notes}</div> : null}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[170px]">
                      <Label>Move stage</Label>
                      <div className="flex flex-wrap gap-2">
                        {STAGES.map((s) => (
                          <button
                            key={s}
                            onClick={() => setStage(it.id, s)}
                            className={
                              "rounded-xl px-3 py-2 text-xs border transition " +
                              (it.stage === s ? "bg-accent border-white/15" : "bg-white/5 border-white/10 hover:bg-white/10")
                            }
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <Button variant="danger" onClick={() => remove(it.id)} className="mt-2">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {!filtered.length ? (
                <Card className="p-6">
                  <div className="text-sm text-white/70">No items yet. Add your first contact on the left.</div>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
