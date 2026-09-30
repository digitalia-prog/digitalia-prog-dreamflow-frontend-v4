"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {getRecentCreatives, libraryError, LIBRARY_EVENT, type RecentCreative} from "@/lib/recentCreatives";
export function useCreativeLibrary() {
  const [creatives,setCreatives] = useState<RecentCreative[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const seq = ++sequence.current; setLoading(true); setError("");
    try { const rows = await getRecentCreatives(); if (seq === sequence.current) setCreatives(rows); }
    catch (e) { if (seq === sequence.current) {setCreatives([]);setError(libraryError(e));} }
    finally {if (seq === sequence.current) setLoading(false);}
  },[]);
  useEffect(() => {
    void refresh();
    const onRefresh = () => {void refresh();};
    const {data} = createClient().auth.onAuthStateChange(() => {
      ++sequence.current; setCreatives([]);
      // Pas d'appel Supabase dans le callback synchrone d'authentification.
      setTimeout(onRefresh,0);
    });
    window.addEventListener(LIBRARY_EVENT,onRefresh);
    window.addEventListener("focus",onRefresh);
    return () => {++sequence.current;data.subscription.unsubscribe();window.removeEventListener(LIBRARY_EVENT,onRefresh);window.removeEventListener("focus",onRefresh);};
  },[refresh]);
  return {creatives,loading,error,refresh};
}
