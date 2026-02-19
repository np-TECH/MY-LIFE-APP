"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, Button, Input, Label } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white/90 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-6">
          <div className="mb-1 text-xs text-white/60">Njabulo OS</div>
          <div className="text-2xl font-bold">Sign in</div>
          <div className="mt-2 text-sm text-white/60">Use your email to receive a secure magic link.</div>

          <div className="mt-6 space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
          {sent ? <div className="mt-3 text-sm text-emerald-300">Magic link sent. Check your inbox.</div> : null}

          <div className="mt-5">
            <Button
              disabled={!email || loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                const { error } = await supabase.auth.signInWithOtp({
                  email,
                  options: {
                    emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/today` : undefined,
                  },
                });
                setLoading(false);
                if (error) setError(error.message);
                else setSent(true);
              }}
              className="w-full"
            >
              {loading ? "Sending…" : "Send magic link"}
            </Button>
          </div>

          <div className="mt-6 text-xs text-white/50">
            Tip: Add this app to your phone home screen for an “app-like” feel.
          </div>
        </Card>
      </div>
    </div>
  );
}
