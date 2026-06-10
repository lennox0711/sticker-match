"use client";

import ExcelImport from "@/components/ExcelImport";
import ExcelExport from "@/components/ExcelExport";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
  sortMode: string;
  setSortMode: (value: string) => void;
  stickers: Record<string, number>;
  setStickers: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  resetCollection: () => void;
  user: any;
  logout: () => void;
};

export default function SettingsModal({
  showSettings,
  setShowSettings,
  sortMode,
  setSortMode,
  stickers,
  setStickers,
  resetCollection,
  user,
  logout,
}: Props) {

  const [username, setUsername] =
  useState("");

useEffect(() => {
  const loadProfile = async () => {
    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

    if (data?.username) {
      setUsername(data.username);
    }
  };

  loadProfile();
}, [user]);

const saveUsername = async () => {
  const { error } =
    await supabase
      .from("profiles")
      .update({
        username,
      })
      .eq("id", user.id);

  if (error) {
    alert(
      "Fehler beim Speichern"
    );
    return;
  }

  alert(
    "Benutzername gespeichert"
  );
};

  if (!showSettings) return null;


  return (
    <>
     {showSettings && (
       <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end pointer-events-auto">
         <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up">
           <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mb-6" />
     
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-zinc-800">
               Einstellungen
             </h2>
     
             <button
               onClick={() => setShowSettings(false)}
               className="text-zinc-500 hover:text-black text-xl"
             >
               ✕
             </button>
           </div>
     
          <div className="space-y-6">
       <div>
         <h3 className="text-zinc-500 text-sm font-semibold mb-3 uppercase tracking-wide">
           Sortierung
         </h3>
     
         <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1">
           <button
             onClick={() => setSortMode("alphabet")}
             className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
               sortMode === "alphabet"
                 ? "bg-zinc-900 text-white shadow-sm"
                 : "text-zinc-600 hover:bg-zinc-200"
             }`}
           >
             A–Z
           </button>
     
           <button
             onClick={() => setSortMode("progress")}
             className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
               sortMode === "progress"
                 ? "bg-zinc-900 text-white shadow-sm"
                 : "text-zinc-600 hover:bg-zinc-200"
             }`}
           >
             Fortschritt
           </button>
     
           <button
             onClick={() => setSortMode("album")}
             className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
               sortMode === "album"
                 ? "bg-zinc-900 text-white shadow-sm"
                 : "text-zinc-600 hover:bg-zinc-200"
             }`}
           >
             Heft
           </button>
         </div>
       </div>
     
       <div>
         <h3 className="text-zinc-500 text-sm font-semibold mb-3 uppercase tracking-wide">
           Daten
         </h3>
     
        <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1">
       <div className="flex-1">
         <ExcelImport
  setStickers={setStickers}
  user={user}
/>
         
       </div>
     
       <div className="flex-1">
         <ExcelImport
  setStickers={setStickers}
  user={user}
         />
       </div>
     </div>
       </div>
     
       <div>
       <h3 className="text-zinc-500 text-sm font-semibold mb-3 uppercase tracking-wide">
         Konto
       </h3>
     
       <div className="bg-zinc-100 rounded-2xl p-3 mb-3">
         <p className="text-xs text-zinc-400">
           Eingeloggt als
         </p>
     
         <p className="text-sm font-medium text-zinc-700 truncate">
           {user.email}
         </p>
       </div>
       
     <div className="mb-4">
  <p className="text-xs text-zinc-400 mb-2">
    Benutzername
  </p>

  <input
    value={username}
    onChange={(e) =>
      setUsername(
        e.target.value
      )
    }
    placeholder="z.B. Collector123"
    className="
      w-full
      rounded-xl
      border
      border-zinc-200
      px-3
      py-2
      text-sm
    "
  />

  <button
    onClick={saveUsername}
    className="
      mt-2
      w-full
      rounded-xl
      bg-emerald-500
      text-white
      py-2
      text-sm
      font-medium
    "
  >
    Speichern
  </button>
</div>
       <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1">
         <button
           onClick={logout}
           className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-zinc-200 text-zinc-700"
         >
           Logout
         </button>
     
         <button
           onClick={resetCollection}
           className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-rose-100 text-rose-500"
         >
           Sticker zurücksetzen
         </button>
       </div>
     </div>
     </div>
     
         </div>
       </div>
     )}
    </>
  );
}