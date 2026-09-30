"use client";
import Link from "next/link";
import {useParams,useRouter} from "next/navigation";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {getCreative,deleteCreative,libraryError,safeSourceUrl,type RecentCreative} from "@/lib/recentCreatives";
const labels: Record<string,string> = {transcript:"Transcription",summary:"Résumé",hook:"Hook",structure:"Structure",angle:"Angle",psychology:"Psychologie",strengths:"Points forts",weaknesses:"Points faibles",recreateIdeas:"Idées de création",similarHooks:"Hooks alternatifs",similarAngles:"Angles alternatifs",scriptPrompt:"Brief de script",viralScore:"Score",whyItWorks:"Pourquoi cela fonctionne",howToBeat:"Comment faire mieux",adsAngles:"Angles publicitaires",variants:"Variantes",script:"Script",shotlist:"Plan de tournage",cta:"Appel à l’action",proof:"Preuve",title:"Titre",content:"Contenu",text:"Texte"};
function ResultValue({value,depth=0}: {value:unknown;depth?:number}) {
 if(value == null) return null;
 if(depth>12) return <pre className="whitespace-pre-wrap break-words">{JSON.stringify(value,null,2)}</pre>;
 if(Array.isArray(value)) return <div className="space-y-3">{value.map((v,i)=><div key={i} className="border-l border-violet-400/20 pl-3"><ResultValue value={v} depth={depth+1}/></div>)}</div>;
 if(typeof value === "object") return <div className="space-y-5">{Object.entries(value).map(([key,v])=><section key={key}><h2 className="mb-2 font-semibold text-violet-200">{labels[key] || key.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/_/g," ")}</h2><ResultValue value={v} depth={depth+1}/></section>)}</div>;
 return <p className="whitespace-pre-wrap break-words leading-7 text-white/80">{String(value)}</p>;
}
export default function SavedCreativePage() {
 const {id}=useParams<{id:string}>();const router=useRouter();const [item,setItem]=useState<RecentCreative|null>(null);const [error,setError]=useState("");const [loading,setLoading]=useState(true);const [attempt,setAttempt]=useState(0);const [deleting,setDeleting]=useState(false);
 useEffect(()=>{
  let active=true;setLoading(true);setItem(null);setError("");
  getCreative(id).then(row=>{if(active){setItem(row);if(!row)setError("Cette création est introuvable ou ne fait pas partie de votre compte.");}}).catch(e=>{if(active)setError(libraryError(e));}).finally(()=>{if(active)setLoading(false);});
  const {data}=createClient().auth.onAuthStateChange(event=>{if(event === "SIGNED_OUT"){active=false;setItem(null);router.replace("/login");}});
  return ()=>{active=false;data.subscription.unsubscribe();};
 },[id,attempt,router]);
 async function remove(){if(!window.confirm("Supprimer cette création de votre bibliothèque ?"))return;setDeleting(true);try{await deleteCreative(id);router.push("/dashboard/library");}catch(e){setError(libraryError(e));setDeleting(false);}}
 return <main className="mx-auto max-w-5xl space-y-6"><Link href="/dashboard/library" className="text-violet-300 underline">← Bibliothèque</Link>{loading && <p>Chargement…</p>}{error && <p role="alert">{error} <button className="underline" onClick={()=>setAttempt(x=>x+1)}>Réessayer</button></p>}{item && <><header className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><h1 className="text-2xl font-bold">{item.advertiserName || "Création sauvegardée"}</h1><p className="mt-2 text-white/50">{item.platform} · {new Date(item.savedAt).toLocaleDateString("fr-FR")}</p><div className="mt-4 flex gap-5">{safeSourceUrl(item.sourceUrl) && <a className="underline" href={safeSourceUrl(item.sourceUrl)} target="_blank" rel="noreferrer">Voir la source</a>}<button disabled={deleting} onClick={()=>void remove()} className="text-rose-300 underline">{deleting ? "Suppression…" : "Supprimer"}</button></div></header><article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">{item.result ? <ResultValue value={item.result}/> : <p>Cette ancienne fiche ne contient pas le résultat complet de l’analyse. {item.adText}</p>}</article><p className="text-xs text-white/40">Les résultats textuels sont conservés. Les fichiers audio et vidéo originaux ne sont pas archivés ici.</p></>}</main>;
}
