"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {getLegacyCreatives,saveRecentCreative,libraryError} from "@/lib/recentCreatives";
export default function LegacyLibraryImport() {
  const [count,setCount]=useState(0);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
  useEffect(()=>{setCount(getLegacyCreatives().length);},[]);
  async function run() {
    if (!window.confirm("Ces anciennes fiches viennent de ce navigateur et n’étaient liées à aucun compte. Confirmez qu’elles vous appartiennent avant de les copier dans votre compte actuel.")) return;
    setBusy(true);setMessage("");
    try {
      const {data,error}=await createClient().auth.getUser();if(error || !data.user) throw error || new Error("Session absente");
      for(const item of getLegacyCreatives()) {
        // Identifiant déterministe par compte : une reprise d'import ne crée pas de doublons.
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(data.user.id+":"+item.id)))).map(x=>x.toString(16).padStart(2,"0")).join("");
        const id=`${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
        const {id:oldId,savedAt,...payload}=item;
        await saveRecentCreative({...payload,kind:"legacy"},id,data.user.id);
      }
      setMessage("Anciennes fiches copiées. Leurs analyses complètes n’étaient pas enregistrées. Les originaux locaux sont conservés.");
    } catch(e) {setMessage(libraryError(e));} finally {setBusy(false);}
  }
  if(!count) return null;
  return <section className="rounded-2xl border border-white/10 p-4 text-sm text-white/70"><p>{count} anciennes fiches existent sur ce navigateur.</p><button disabled={busy} onClick={()=>void run()} className="mt-2 text-violet-300 underline disabled:opacity-50">{busy ? "Import en cours…" : "Importer mes anciennes fiches dans ce compte"}</button><p role="status">{message}</p></section>;
}
