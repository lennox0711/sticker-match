"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GroupsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [groups, setGroups] =
    useState<any[]>([]);

  const [groupName, setGroupName] =
    useState("");

  const [description, setDescription] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadGroups = async () => {
      const { data, error } =
        await supabase
          .from("groups")
          .select("*")
          .order("name");

      if (error) {
        console.error(error);
        return;
      }

      setGroups(data || []);
    };

    loadGroups();
  }, []);

  const createGroup =
    async () => {
      if (!groupName.trim()) return;

      const { error } =
        await supabase
          .from("groups")
          .insert({
            name: groupName,
            description,
            admin_id: user.id,
          });

      if (error) {
        console.error(error);
        alert(
          "Fehler beim Erstellen"
        );
        return;
      }

      setGroupName("");
      setDescription("");

      const { data } =
        await supabase
          .from("groups")
          .select("*")
          .order("name");

      setGroups(data || []);
    };

  return (
    <main className="min-h-screen bg-zinc-100 p-4">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() =>
            router.push("/")
          }
          className="
            mb-4
            text-zinc-500
          "
        >
          ← Zurück
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Gruppen 👥
        </h1>

        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          <h2 className="font-bold mb-4">
            Neue Gruppe
          </h2>

          <input
            value={groupName}
            onChange={(e) =>
              setGroupName(
                e.target.value
              )
            }
            placeholder="Gruppenname"
            className="
              w-full
              border
              border-zinc-200
              rounded-xl
              px-3
              py-2
              mb-3
            "
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Beschreibung"
            className="
              w-full
              border
              border-zinc-200
              rounded-xl
              px-3
              py-2
              mb-3
            "
          />

          <button
            onClick={createGroup}
            className="
              w-full
              bg-emerald-500
              text-white
              rounded-xl
              py-3
              font-semibold
            "
          >
            Gruppe erstellen
          </button>
        </div>

        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="
                bg-white
                rounded-3xl
                p-5
                shadow-sm
              "
            >
              <h2 className="font-bold">
                {group.name}
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                {group.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}