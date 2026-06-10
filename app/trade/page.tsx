"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";



const albumCountries = [
  { code: "FWC", name: "FIFA World Cup" },
  { code: "MEX", name: "Mexiko" },
  { code: "RSA", name: "Südafrika" },
  { code: "KOR", name: "Südkorea" },
  { code: "CZE", name: "Tschechien" },
  { code: "CAN", name: "Kanada" },
  { code: "BIH", name: "Bosnien und Herzegowina" },
  { code: "QAT", name: "Katar" },
  { code: "SUI", name: "Schweiz" },
  { code: "BRA", name: "Brasilien" },
  { code: "MAR", name: "Marokko" },
  { code: "HAI", name: "Haiti" },
  { code: "SCO", name: "Schottland" },
  { code: "USA", name: "USA" },
  { code: "PAR", name: "Paraguay" },
  { code: "AUS", name: "Australien" },
  { code: "TUR", name: "Türkei" },
  { code: "GER", name: "Deutschland" },
  { code: "CUW", name: "Curaçao" },
  { code: "CIV", name: "Elfenbeinküste" },
  { code: "ECU", name: "Ecuador" },
  { code: "NED", name: "Niederlande" },
  { code: "JPN", name: "Japan" },
  { code: "SWE", name: "Schweden" },
  { code: "TUN", name: "Tunesien" },
  { code: "BEL", name: "Belgien" },
  { code: "EGY", name: "Ägypten" },
  { code: "IRN", name: "Iran" },
  { code: "NZL", name: "Neuseeland" },
  { code: "ESP", name: "Spanien" },
  { code: "CPV", name: "Kap Verde" },
  { code: "KSA", name: "Saudi-Arabien" },
  { code: "URU", name: "Uruguay" },
  { code: "FRA", name: "Frankreich" },
  { code: "SEN", name: "Senegal" },
  { code: "IRQ", name: "Irak" },
  { code: "NOR", name: "Norwegen" },
  { code: "ARG", name: "Argentinien" },
  { code: "ALG", name: "Algerien" },
  { code: "AUT", name: "Österreich" },
  { code: "JOR", name: "Jordanien" },
  { code: "POR", name: "Portugal" },
  { code: "COD", name: "DR Kongo" },
  { code: "UZB", name: "Usbekistan" },
  { code: "COL", name: "Kolumbien" },
  { code: "ENG", name: "England" },
  { code: "CRO", name: "Kroatien" },
  { code: "GHA", name: "Ghana" },
  { code: "PAN", name: "Panama" },
];

export default function TradePage() {
  const router = useRouter();

  // States

  const [user, setUser] =
    useState<any>(null);

  const [stickers, setStickers] =
    useState<Record<string, number>>({});

  const [profiles, setProfiles] =
    useState<any[]>([]);

  const [showDuplicates, setShowDuplicates] =
    useState(false);

  const [showMissing, setShowMissing] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  const [selectedUserStickers, setSelectedUserStickers] =
     useState<Record<string, number>>({}); 

  const [matchStats, setMatchStats] =
      useState<
    Record<
      string,
      {
        matches: number;
        reverseMatches: number;
      }
    >
  >({});

  const [tradeView, setTradeView] =
  useState<"global" | "groups">(
    "global"
  );

  const [groups, setGroups] =
  useState<any[]>([]);

  const [
  showCreateGroup,
  setShowCreateGroup,
] = useState(false);

const [groupName, setGroupName] =
  useState("");

const [groupDescription,
  setGroupDescription] =
  useState("");

  const [myMemberships, setMyMemberships] =
  useState<any[]>([]);

  const [
  pendingRequests,
  setPendingRequests,
] = useState<any[]>([]);

const [tradeMode, setTradeMode] =
  useState<
    "global" | "groups"
  >("global");

 const [
  groupMatches,
  setGroupMatches,
] = useState<any[]>([]);


const [
  groupMatchCounts,
  setGroupMatchCounts,
] = useState<
  Record<string, number>
>({});

const [
  showSettings,
  setShowSettings,
] = useState(false);

  // User laden

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

  // Sticker laden

  useEffect(() => {
    const loadStickers = async () => {
      if (!user) return;

      const { data, error } =
        await supabase
          .from("stickers")
          .select(
            "sticker_id, value"
          )
          .eq(
            "user_id",
            user.id
          );

      if (error) {
        console.error(error);
        return;
      }

      const stickerMap:
        Record<string, number> = {};

      data?.forEach((row) => {
        stickerMap[row.sticker_id] =
          row.value;
      });

      setStickers(stickerMap);
    };

    loadStickers();
  }, [user]);

  // Profile laden

  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } =
        await supabase
          .from("profiles")
          .select("*");

      console.log(
        "Profiles:",
        data
      );

      console.log(
        "Profiles Error:",
        error
      );

      setProfiles(data || []);
    };

    loadProfiles();
  }, []);

  useEffect(() => {
  const loadSelectedUserStickers =
    async () => {
      if (!selectedUser) return;

      const { data, error } =
        await supabase
          .from("stickers")
          .select(
            "sticker_id, value"
          )
          .eq(
            "user_id",
            selectedUser.id
          );

      if (error) {
        console.error(error);
        return;
      }

      const stickerMap:
        Record<string, number> = {};

      data?.forEach((row) => {
        stickerMap[row.sticker_id] =
          row.value;
      });

      setSelectedUserStickers(
        stickerMap
      );
    };

  loadSelectedUserStickers();
}, [selectedUser]);


// Gruppe verwalten

const [selectedGroup, setSelectedGroup] =
  useState<any>(null);

// Gruppe suchen

const [groupSearch, setGroupSearch] =
  useState("");

const [searchResults, setSearchResults] =
  useState<any[]>([]);

// Gruppen laden

useEffect(() => {
  const loadGroups = async () => {
    if (!user) return;

    const { data, error } =
      await supabase
        .from("groups")
        .select(`
          *,
          group_members (
            id,
            status
          )
        `)
        .eq(
          "admin_id",
          user.id
        );

    if (error) {
      console.error(error);
      return;
    }

    setGroups(data || []);
  };

  loadGroups();
}, [user]);

// Gruppe erstellen

const createGroup = async () => {
  if (!groupName.trim()) return;

  const { data, error } =
    await supabase
      .from("groups")
      .insert({
        name: groupName,
        description:
          groupDescription,
        admin_id: user.id,
      })
      .select()
      .single();

  if (error) {
    console.error(error);
    alert(
      "Fehler beim Erstellen"
    );
    return;
  }

  await supabase
    .from("group_members")
    .insert({
      group_id: data.id,
      user_id: user.id,
      status: "approved",
    });

  setShowCreateGroup(false);

  setGroupName("");
  setGroupDescription("");

  const { data: groupsData } =
    await supabase
      .from("groups")
      .select(`
        *,
        group_members (
          id
        )
      `)
      .eq(
        "admin_id",
        user.id
      );

  setGroups(groupsData || []);
};

// Gruppen suchen

const searchGroups = async () => {
  if (!groupSearch.trim())
    return;

  const { data, error } =
    await supabase
      .from("groups")
      .select("*")
      .ilike(
        "name",
        `%${groupSearch}%`
      );

  if (error) {
    console.error(error);
    return;
  }

  setSearchResults(
    data || []
  );
};

// Gruppe beitreten

const joinGroup = async (
  groupId: string
) => {
  const { error } =
    await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: user.id,
        status: "pending",
      });

  if (error) {
    console.error(error);
    return;
  }

  alert(
    "Anfrage gesendet"
  );
  const { data } =
  await supabase
    .from("group_members")
    .select("*")
    .eq(
      "user_id",
      user.id
    );

setMyMemberships(
  data || []
);
};

// Mitgliedschaften laden

useEffect(() => {
  const loadMemberships =
    async () => {
      if (!user) return;

      const { data, error } =
        await supabase
          .from("group_members")
          .select("*")
          .eq(
            "user_id",
            user.id
          );

      if (error) {
        console.error(error);
        return;
      }

      setMyMemberships(
        data || []
      );
    };

  loadMemberships();
}, [user]);

// Anfrage laden

const loadPendingRequests =
  async (groupId: string) => {

    const { data, error } =
      await supabase
        .from("group_members")
        .select(`
          *,
          profiles (
            username,
            email
          )
        `)
        .eq(
          "group_id",
          groupId
        )
        .eq(
          "status",
          "pending"
        );

    if (error) {
      console.error(error);
      return;
    }
console.log("Group ID:", groupId);
console.log("Pending:", data);

    setPendingRequests(
      data || []
    );
};

const approveRequest = async (
  requestId: string
) => {
  const { error } =
    await supabase
      .from("group_members")
      .update({
        status: "approved",
      })
      .eq(
        "id",
        requestId
      );

  if (error) {
    console.error(error);
    return;
  }

  if (selectedGroup) {
    loadPendingRequests(
      selectedGroup.id
    );
  }
};

const rejectRequest = async (
  requestId: string
) => {
  const { error } =
    await supabase
      .from("group_members")
      .update({
        status: "rejected",
      })
      .eq(
        "id",
        requestId
      );

  if (error) {
    console.error(error);
    return;
  }

  if (selectedGroup) {
    loadPendingRequests(
      selectedGroup.id
    );
  }
};

 const loadGroupMembers =
  async (groupId: string) => {
    const { data, error } =
      await supabase
        .from("group_members")
        .select(`
          *,
          profiles (
            username,
            email
          )
        `)
        .eq(
          "group_id",
          groupId
        )
        .eq(
          "status",
          "approved"
        );

    if (error) {
      console.error(error);
      return;
    }

    return data || [];
};



const getMatchCount =
  async (
    memberId: string
  ) => {

    const { data, error } =
      await supabase
        .from("stickers")
        .select(
          "sticker_id, value"
        )
        .eq(
          "user_id",
          memberId
        );

    if (error) {
      console.error(error);
      return 0;
    }

    let count = 0;

    data?.forEach(
      (sticker) => {

        const myValue =
          stickers[
            sticker.sticker_id
          ] || 0;

        if (
          myValue === 0 &&
          sticker.value === 2
        ) {
          count++;
        }
      }
    );

    return count;
};

const loadGroupMatches =
  async (groupId: string) => {

    const { data: members } =
      await supabase
        .from("group_members")
        .select(`
          user_id,
          profiles (
            username,
            email
          )
        `)
        .eq(
          "group_id",
          groupId
        )
        .eq(
          "status",
          "approved"
        );

    if (!members) return;

    const results = [];

    for (const member of members) {

      if (
        member.user_id ===
        user.id
      ) {
        continue;
      }
const totalMatches =
  results.reduce(
    (sum, member) =>
      sum +
      member.matchCount,
    0
  );

setGroupMatchCounts(
  (prev) => ({
    ...prev,
    [groupId]:
      totalMatches,
  })
);
      const { data: stickersData } =
        await supabase
          .from("stickers")
          .select(
            "sticker_id, value"
          )
          .eq(
            "user_id",
            member.user_id
          );

      let matchCount = 0;

      stickersData?.forEach(
        (sticker) => {

          const myValue =
            stickers[
              sticker.sticker_id
            ] || 0;

          if (
            myValue === 0 &&
            sticker.value === 2
          ) {
            matchCount++;
          }
        }
      );

      results.push({
        userId:
          member.user_id,
        username:
  member.profiles?.[0]
    ?.username ||
  member.profiles?.[0]
    ?.email ||
  "Unbekannt",
        matchCount,
      });
    }

    results.sort(
      (a, b) =>
        b.matchCount -
        a.matchCount
    );

    setGroupMatches(
      results
    );
};



  // Berechnungen

  const duplicateStickers =
    Object.entries(stickers)
      .filter(
        ([_, value]) =>
          value === 2
      )
      .map(([id]) => id)
      .sort((a, b) => {
        const countryA =
          a.replace(/\d+/g, "");

        const countryB =
          b.replace(/\d+/g, "");

        const indexA =
          albumCountries.findIndex(
            (country) =>
              country.code ===
              countryA
          );

        const indexB =
          albumCountries.findIndex(
            (country) =>
              country.code ===
              countryB
          );

        if (indexA !== indexB) {
          return (
            indexA - indexB
          );
        }

        const numberA =
          parseInt(
            a.replace(
              /[A-Z]/g,
              ""
            )
          );

        const numberB =
          parseInt(
            b.replace(
              /[A-Z]/g,
              ""
            )
          );

        return (
          numberA - numberB
        );
      });

  const duplicatesByCountry =
    albumCountries
      .map((country) => ({
        name: country.name,
        stickers:
          duplicateStickers.filter(
            (sticker) =>
              sticker.startsWith(
                country.code
              )
          ),
      }))
      .filter(
        (country) =>
          country.stickers
            .length > 0
      );

  const missingStickers =
    albumCountries.flatMap(
      (country) =>
        Array.from(
          { length: 20 },
          (_, i) => {
            const id =
              `${country.code}${i + 1}`;

            return (
              (stickers[id] ||
                0) === 0
            )
              ? id
              : null;
          }
        ).filter(
          (
            id
          ): id is string =>
            id !== null
        )
    );

useEffect(() => {
  const calculateMatches =
    async () => {
      if (!user) return;

      const stats: Record<
        string,
        {
          matches: number;
          reverseMatches: number;
        }
      > = {};

      for (const profile of otherProfiles) {
        const { data } =
          await supabase
            .from("stickers")
            .select(
              "sticker_id, value"
            )
            .eq(
              "user_id",
              profile.id
            );

        const stickerMap:
          Record<string, number> = {};

        data?.forEach((row) => {
          stickerMap[
            row.sticker_id
          ] = row.value;
        });

        const userMissing =
          albumCountries.flatMap(
            (country) =>
              Array.from(
                { length: 20 },
                (_, i) => {
                  const id =
                    `${country.code}${i + 1}`;

                  return (
                    (
                      stickerMap[
                        id
                      ] || 0
                    ) === 0
                  )
                    ? id
                    : null;
                }
              ).filter(
                (
                  id
                ): id is string =>
                  id !== null
              )
          );

        const matches =
          missingStickers.filter(
            (sticker) =>
              stickerMap[
                sticker
              ] === 2
          );

        const reverseMatches =
          userMissing.filter(
            (sticker) =>
              stickers[
                sticker
              ] === 2
          );

        stats[profile.id] = {
          matches:
            matches.length,
          reverseMatches:
            reverseMatches.length,
        };
      }

      setMatchStats(stats);
    };

  calculateMatches();
}, [
  user,
  profiles,
  stickers,
  missingStickers,
]);

  const tradeText =
    `🤝 Meine Panini-Tauschliste

📦 Biete:
${duplicateStickers.join("\n")}

❌ Suche:
${missingStickers.join("\n")}
`;

const matches =
  missingStickers.filter(
    (sticker) =>
      selectedUserStickers[
        sticker
      ] === 2
  );

  const selectedUserDuplicates =
  Object.entries(
    selectedUserStickers
  )
    .filter(
      ([_, value]) =>
        value === 2
    )
    .map(([id]) => id);

    const selectedUserMissing =
  albumCountries.flatMap(
    (country) =>
      Array.from(
        { length: 20 },
        (_, i) => {
          const id =
            `${country.code}${i + 1}`;

          return (
            (
              selectedUserStickers[
                id
              ] || 0
            ) === 0
          )
            ? id
            : null;
        }
      ).filter(
        (
          id
        ): id is string =>
          id !== null
      )
  );

  const reverseMatches =
  selectedUserMissing.filter(
    (sticker) =>
      stickers[sticker] === 2
  );
  
const otherProfiles =
  profiles.filter(
    (profile) =>
      profile.id !== user?.id
  );
  <p className="mb-4 text-zinc-500">
  Nutzer: {profiles.length}
</p>
const sortedProfiles =
  [...otherProfiles].sort(
    (a, b) =>
      (matchStats[b.id]
        ?.matches || 0) -
      (matchStats[a.id]
        ?.matches || 0)
  );

  return (
    <main className="min-h-screen bg-zinc-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          Tauschbörse
        </h1>

      <div className="flex gap-2 mb-4">
  <button
    onClick={() =>
      setTradeMode(
        "global"
      )
    }
    className={`
      flex-1
      rounded-xl
      py-3
      font-medium
      ${
        tradeMode ===
        "global"
          ? "bg-zinc-900 text-white"
          : "bg-white"
      }
    `}
  >
    🌍 Global
  </button>

  <button
    onClick={() =>
      setTradeMode(
        "groups"
      )
    }
    className={`
      flex-1
      rounded-xl
      py-3
      font-medium
      ${
        tradeMode ===
        "groups"
          ? "bg-zinc-900 text-white"
          : "bg-white"
      }
    `}
  >
    👥 Gruppen
  </button>
</div>

{tradeMode === "groups" && (
<div className="space-y-3">



{searchResults.map(
  (group) => {

    const membership =
      myMemberships.find(
        (m) =>
          m.group_id ===
          group.id
      );

    return (
      <div
        key={group.id}
        className="
          bg-white
          rounded-3xl
          p-5
          shadow-sm
          mt-3
        "
      >
        <h2 className="font-bold">
          ⚽ {group.name}
        </h2>
{groupMatchCounts[
  group.id
] > 0 && (
  <div
    className="
      mt-2
      text-sm
      text-emerald-600
      font-medium
    "
  >
    🎁{" "}
    {
      groupMatchCounts[
        group.id
      ]
    }
    {" "}
    mögliche Sticker
  </div>
)}
        <p className="text-sm text-zinc-500">
          {group.description}
        </p>

        {!membership && (
          <button
            onClick={() =>
              joinGroup(group.id)
            }
            className="
              mt-3
              w-full
              bg-emerald-500
              text-white
              rounded-xl
              py-2
            "
          >
            Anfrage senden
          </button>
        )}

        {membership?.status ===
          "pending" && (
          <div
            className="
              mt-3
              text-amber-600
              font-medium
              text-sm
            "
          >
            ⏳ Anfrage läuft
          </div>
        )}

        {membership?.status ===
          "approved" && (
          <div
            className="
              mt-3
              text-emerald-600
              font-medium
              text-sm
            "
          >
            ✓ Mitglied
          </div>
        )}
      </div>
    );
  }
)}

 {groups.map((group) => {

  const pendingCount =
  group.group_members?.filter(
    (member: any) =>
      member.status ===
      "pending"
  ).length || 0;

  return (
    <div
  key={group.id}
  onClick={() => {
  setSelectedGroup(group);

  loadPendingRequests(
    group.id
  );

  loadGroupMatches(
    group.id
  );
}}
  className="
    bg-white
    rounded-3xl
    p-5
    shadow-sm
    cursor-pointer
  "
>
      <h2 className="font-bold text-black">
        ⚽ {group.name}
      </h2>

      {pendingCount > 0 && (
        <div
          className="
            mt-2
            text-sm
            text-amber-600
            font-medium
          "
        >
         🔔 {pendingCount}
          {" "}
          Anfrage
         {pendingCount > 1
            ? "n"
            : ""}
        </div>
        
      )}
      {selectedGroup?.id ===
  group.id &&
  groupMatches.length >
    0 && (
    <div
      className="
        mt-4
        border-t
        pt-4
      "
    >
      <h3
        className="
          font-semibold
          mb-3
          text-black
        "
      >
        Mögliche Sticker
      </h3>

      {groupMatches.map(
        (member) => (
          <div
            key={
              member.userId
            }
            className="
              flex
              justify-between
              py-2
            "
          >
            <span>
              {
                member.username
              }
            </span>

            <span
              className="
                font-medium
              "
            >
              {
                member.matchCount
              }
            </span>
          </div>
        )
      )}
    </div>
)}
      {selectedGroup?.id ===
  group.id &&
  pendingRequests.length > 0 && (
    <div
      className="
        mt-4
        border-t
        pt-4
      "
    >
      <h3 className="font-semibold mb-3">
        Beitrittsanfragen
      </h3>

      {pendingRequests.map(
        (request) => (
          <div
            key={request.id}
            className="
              flex
              justify-between
              items-center
              py-2
            "
          >
            <span>
              {request.profiles
                ?.username ||
                request.profiles
                  ?.email}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  approveRequest(
                    request.id
                  )
                }
                className="
                  px-3
                  py-1
                  bg-emerald-500
                  text-white
                  rounded-lg
                "
              >
                Annehmen
              </button>

              <button
                onClick={() =>
                  rejectRequest(
                    request.id
                  )
                }
                className="
                  px-3
                  py-1
                  bg-rose-500
                  text-white
                  rounded-lg
                "
              >
                Ablehnen
              </button>
            </div>
          </div>
        )
      )}
    </div>
)}
    </div>
  );
})}
<div className="bg-white rounded-3xl p-5 shadow-sm mt-4">
  <h2 className="font-bold mb-3">
    🔍 Gruppe suchen
  </h2>

  <input
    value={groupSearch}
    onChange={(e) =>
      setGroupSearch(
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

  <button
    onClick={searchGroups}
    className="
      w-full
      bg-zinc-900
      text-white
      rounded-xl
      py-3
      font-medium
    "
  >
    Suchen
  </button>
</div>

 <button
    onClick={() =>
      setShowCreateGroup(true)
    }
    className="
      w-full
      bg-emerald-500
      text-white
      rounded-2xl
      py-3
      font-semibold
    "
  >
    ➕ Gruppe erstellen
  </button>
</div>
)}

<input
  value={groupSearch}
  onChange={(e) =>
    setGroupSearch(
      e.target.value
    )
  }
  placeholder="Gruppe suchen"
  className="
    w-full
    border
    rounded-xl
    px-3
    py-2
  "
/>

{showCreateGroup && (
  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      className="
        bg-white
        rounded-3xl
        p-5
        w-[90%]
        max-w-md
      "
    >
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
          rounded-xl
          px-3
          py-2
          mb-3
        "
      />

      <textarea
        value={groupDescription}
        onChange={(e) =>
          setGroupDescription(
            e.target.value
          )
        }
        placeholder="Beschreibung"
        className="
          w-full
          border
          rounded-xl
          px-3
          py-2
          mb-3
        "
      />
      <div className="flex gap-2">
  <button
    onClick={() =>
      setShowCreateGroup(false)
    }
    className="
      flex-1
      bg-zinc-100
      rounded-xl
      py-3
      font-medium
    "
  >
    Abbrechen
  </button>

  <button
    onClick={createGroup}
    className="
      flex-1
      bg-emerald-500
      text-white
      rounded-xl
      py-3
      font-medium
    "
  >
    Erstellen
  </button>
</div>
    </div>
  </div>
)}
{tradeMode === "global" && (
        <div className="bg-white rounded-3xl p-5 shadow-sm mt-4 text-zinc-900">
  <h2 className="font-bold text-black mb-3">
    Andere Nutzer ({profiles.length-1})
  </h2>

 {otherProfiles.length === 0 ? (
  <p className="text-zinc-500">
    Keine anderen Nutzer gefunden
  </p>
) : (
  sortedProfiles.map((profile) => (
    <button
  key={profile.id}
  onClick={() =>
  setSelectedUser(
    selectedUser?.id ===
      profile.id
      ? null
      : profile
  )
}
  className="
    w-full
    text-left
    p-4
    rounded-2xl
    bg-zinc-50
    hover:bg-zinc-100
    transition
    mb-2
  "
>
  <p className="font-medium">
    {profile.username}
  </p>

  <div className="flex gap-4 mt-2 text-sm">
    <span>
      Kann ich gebrauchen: {" "}
      {matchStats[
        profile.id
      ]?.matches || 0}
    </span>

    <span>
      Kann ich anbieten: {" "}
      {matchStats[
        profile.id
      ]?.reverseMatches ||
        0}
    </span>
  </div>
</button>

  ))
)}
</div>
)}
{selectedUser && (
  <div className="bg-white rounded-3xl p-5 shadow-sm mt-4 text-zinc-900">
    <h2 className="font-bold text-black mb-2">
      Match mit
    </h2>

    <p className="mb-3">
      {selectedUser.username}
    </p>

  <div className="grid grid-cols-2 gap-3 mb-4">
  <div className="bg-emerald-50 rounded-2xl p-3">
    <p className="text-sm text-zinc-500">
      Ich bekomme
    </p>

    <p className="text-2xl font-bold text-emerald-600">
      {matches.length}
    </p>
  </div>

  <div className="bg-blue-50 rounded-2xl p-3">
    <p className="text-sm text-zinc-500">
      Ich biete
    </p>

    <p className="text-2xl font-bold text-blue-600">
      {reverseMatches.length}
    </p>
    
  </div>
</div>

    {matches.length === 0 ? (
      <p className="text-zinc-500">
        Keine Treffer gefunden
      </p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {matches.map(
          (sticker) => (
            <span
              key={sticker}
              className="
                px-3
                py-1
                rounded-full
                bg-emerald-100
                text-emerald-700
                text-sm
                font-medium
              "
            >
              {sticker}
            </span>
          )
        )}
        
      </div>
    )}
    {reverseMatches.length > 0 && (
  <>
    <h3 className="font-semibold text-black mt-5 mb-2">
      Das kann ich anbieten
    </h3>

    <div className="flex flex-wrap gap-2">
      {reverseMatches.map(
        (sticker) => (
          <span
            key={sticker}
            className="
              px-3
              py-1
              rounded-full
              bg-blue-100
              text-blue-700
              text-sm
              font-medium
            "
          >
            {sticker}
          </span>
        )
      )}
    </div>
  </>
)}
  </div>
)}
<br></br>
        <div className="bg-white text-black rounded-3xl p-5 shadow-sm">
  <button
    onClick={() =>
      setShowDuplicates(
        !showDuplicates
      )
    }
    className="
      w-full
      flex
      justify-between
      items-center
      font-bold
      mb-3
    "
  >
    <span>
      Meine Doppelten
    </span>

    <span>
      {showDuplicates
        ? "▲"
        : "▼"}
    </span>
  </button>

  <p className="text-sm text-zinc-500 mb-3">
    {duplicateStickers.length} doppelte Sticker
  </p>

  {showDuplicates && (
    duplicateStickers.length === 0 ? (
      <p className="text-zinc-500">
        Keine doppelten Sticker
      </p>
    ) : (
      <div className="space-y-4">
        {duplicatesByCountry.map(
          (country) => (
            <div key={country.name}>
              <h3 className="text-sm uppercase tracking-wide text-zinc-500 mb-2">
                {country.name}
              </h3>

              <div className="flex flex-wrap gap-2">
                {country.stickers.map(
                  (sticker) => (
                    <span
                      key={sticker}
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-amber-100
                        text-amber-700
                        text-sm
                        font-medium
                      "
                    >
                      {sticker}
                    </span>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    )
  )}
</div>

  <div className="bg-white text-black rounded-3xl p-5 shadow-sm mt-4">
  <button
  onClick={() =>
    setShowMissing(
      !showMissing
    )
  }
  className="
    w-full
    flex
    justify-between
    items-center
    font-bold
    mb-3
  "
>
  <span>
    Fehlende Sticker
  </span>

  <span>
    {showMissing
      ? "▲"
      : "▼"}
  </span>
</button>
<p className="text-sm text-zinc-500 mb-3">
  {missingStickers.length} fehlende Sticker
</p>
 {showMissing && (
  missingStickers.length === 0 ? (
    <p className="text-zinc-500">
      Keine fehlenden Sticker
    </p>
  ) : (
    <div className="flex flex-wrap gap-2">
      {missingStickers.map(
        (sticker) => (
          <span
            key={sticker}
            className="
              px-3
              py-1
              rounded-full
              bg-rose-100
              text-rose-700
              text-sm
              font-medium
            "
          >
            {sticker}
          </span>
        )
      )}
    </div>
  )
)}
</div>
<br></br>

  <button
  onClick={async () => {
  await navigator.clipboard.writeText(
    tradeText
  );

  alert("Tauschliste kopiert");
}}
    

  className="w-full bg-emerald-500 text-white rounded-2xl p-3 font-semibold"
>
  Tauschliste kopieren
</button>
</div>
<div
  className="
    flex
    justify-between
    items-center
    mb-4
  "
>
  <button
    onClick={() =>
      router.push("/")
    }
    className="
      text-zinc-500
      hover:text-zinc-900
    "
  >
    ← Zur Sammlung
  </button>

 
</div>


    </main>
  );
}