"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      window.location.href = data.session ? "/today" : "/login";
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white/80 flex items-center justify-center">
      <div className="text-sm">Loading…</div>
    </div>
  );
}
