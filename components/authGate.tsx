"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRequireAuth() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/login";
      else setLoading(false);
    });
  }, []);

  return { loading };
}
