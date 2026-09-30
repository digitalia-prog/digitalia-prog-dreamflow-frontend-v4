"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {saveRecentCreative,libraryError,type RecentCreative} from "@/lib/recentCreatives";
type Input = Omit<RecentCreative,"id"|"savedAt">;
export default function SaveCreative({creative}: {creative:Input}) {
  const [status,setStatus] = useState("saving");
  const [error,setError] = useState("");
  const job = useRef<{input:Input;id:string;owner:string;running:boolean}|null>(null);
  const latest = useRef(creative); latest.current = creative;
  async function save() {
    const task = job.current; if (!task || task.running) return;
    task.running = true; setStatus("saving"); setError("");
    try {
      if (!task.owner) {const {data,error} = await createClient().auth.getUser(); if(error || !data.user) throw error || new Error("Session absente"); task.owner=data.user.id;}
      await saveRecentCreative(task.input,task.id,task.owner);
      if (job.current === task) setStatus("saved");
    } catch(e) {if(job.current === task) {setStatus("error");setError(libraryError(e));}}
    finally {task.running=false;}
  }
  useEffect(() => {
    // Une seule écriture par résultat, y compris sous React StrictMode.
    if (!job.current || job.current.input.result !== latest.current.result) {
      job.current={input:latest.current,id:(globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`),owner:"",running:false};
      void save();
    }
  },[creative.result]);
  return <div role="status" className="my-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm text-white/80">
    {status === "saving" ? "Enregistrement dans votre bibliothèque…" : status === "saved" ? <><span>Enregistré dans votre bibliothèque. </span><Link className="underline text-violet-200" href={`/dashboard/library/${job.current?.id}`}>Ouvrir</Link></> : <><span>{error} </span><button type="button" className="underline text-violet-200" onClick={() => void save()}>Réessayer l’enregistrement</button></>}
  </div>;
}
