"use client";

import { useState, useEffect } from "react";

import Stats from "@/components/Stats";
import Search from "@/components/Search";
import CountrySection from "@/components/CountrySection";
import Auth from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { Caveat } from "next/font/google";
import SettingsModal from "@/components/SettingsModal";
import TradeSection from "@/components/TradeSection";
import MissingSectionX from "@/components/MissingSection";
import { useRouter } from "next/navigation";



const caveat = Caveat({
  subsets: ["latin"],
});
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

const alphabeticalCountries =
  [...albumCountries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

export default function Home() {
  const [stickers, setStickers] =
useState<Record<string, number>>({});

const [user, setUser] =
useState<any>(null);

const [search, setSearch] =
useState("");

const [filter, setFilter] =
useState("alle");

const router = useRouter();

const [sortMode, setSortMode] =
useState("album");

const [showDuplicates, setShowDuplicates] =
useState(false);

const [showMissing, setShowMissing] =
useState(false);

const [showSettings, setShowSettings] =
useState(false);

const [openCountries, setOpenCountries] =
useState<Record<string, boolean>>({});

const [favorites, setFavorites] =
useState<string[]>([]);

useEffect(() => {
supabase.auth.getUser().then(
({ data }) => {
setUser(data.user);
}
);

const {
data: { subscription },
} = supabase.auth.onAuthStateChange(
(_event, session) => {
setUser(session?.user ?? null);
}
);

return () => {
subscription.unsubscribe();
};
}, []);

useEffect(() => {
if (user) {
setShowSettings(false);
}
}, [user]);

const countries =
  sortMode === "album"
    ? albumCountries
    : sortMode === "alphabet"
    ? alphabeticalCountries
    : [...albumCountries].sort((a, b) => {
        const progressA = Array.from(
          { length: 20 },
          (_, i) => {
            const id = `${a.code}${i + 1}`;
            return stickers[id] || 0;
          }
        ).filter((v) => v > 0).length;

        const progressB = Array.from(
          { length: 20 },
          (_, i) => {
            const id = `${b.code}${i + 1}`;
            return stickers[id] || 0;
          }
        ).filter((v) => v > 0).length;

        return progressB - progressA;
      });
useEffect(() => {
const value =
search.toUpperCase();

if (value.length < 3) return;

const match =
countries.find(
(country) =>
country.code.startsWith(
value
)
);

if (!match) return;

setOpenCountries((prev) => ({
...prev,
[match.code]: true,
}));

setTimeout(() => {
window.scrollTo({
top:
document.getElementById(
match.code
)!.offsetTop - 270,
behavior: "smooth",
});
}, 100);
}, [search, countries]);

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

    if (!data || data.length === 0) {
      return;
    }

    const stickerMap:
      Record<string, number> = {};

    data.forEach((row) => {
      stickerMap[row.sticker_id] =
        row.value;
    });

    setStickers(stickerMap);
  };

  loadStickers();
}, [user]);

useEffect(() => {
  const loadFavorites =
    async () => {
      const savedFavorites =
        localStorage.getItem(
          "panini-favorites"
        );

      if (savedFavorites) {
        setFavorites(
          JSON.parse(
            savedFavorites
          )
        );
      }

      if (!user) return;

      const {
        data,
        error,
      } = await supabase
        .from("favorites")
        .select(
          "country_code"
        )
        .eq(
          "user_id",
          user.id
        );

      if (error) {
        console.error(error);
        return;
      }

      if (
        data &&
        data.length > 0
      ) {
        setFavorites(
          data.map(
            (item) =>
              item.country_code
          )
        );
      }
    };

  loadFavorites();
}, [user]);

useEffect(() => {
localStorage.setItem(
"panini-favorites",
JSON.stringify(favorites)
);
}, [favorites]);

const toggleSticker = async (
  id: string
) => {
  const newValue =
    ((stickers[id] || 0) + 1) % 3;

  setStickers((prev) => ({
    ...prev,
    [id]: newValue,
  }));

  if (!user) return;

  const { error } =
    await supabase
      .from("stickers")
      .upsert(
        {
          user_id: user.id,
          sticker_id: id,
          value: newValue,
        },
        {
          onConflict:
            "user_id,sticker_id",
        }
      );

  if (error) {
    console.error(error);
  }
};

const toggleCountry = (
  country: string
) => {
  setOpenCountries((prev) => ({
    [country]:
      !prev[country],
  }));
};

const toggleFavorite =
async (
country: string
) => {
const isFavorite =
favorites.includes(
country
);

if (isFavorite) {
  const newFavorites =
    favorites.filter(
      (c) =>
        c !== country
    );

  setFavorites(
    newFavorites
  );

  if (user) {
    await supabase
      .from(
        "favorites"
      )
      .delete()
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "country_code",
        country
      );
  }
} else {
  const newFavorites =
    [
      ...favorites,
      country,
    ];

  setFavorites(
    newFavorites
  );

  if (user) {
    await supabase
      .from(
        "favorites"
      )
      .insert([
        {
          user_id:
            user.id,
          country_code:
            country,
        },
      ]);
  }
}

};

const totalStickers =
countries.length * 20;

const collected =
Object.values(stickers)
.filter(
(value) => value > 0
).length;

const duplicates =
Object.values(stickers)
.filter(
(value) =>
value === 2
).length;

const searchValue =
stickers[
search.toUpperCase()
] ?? 0;

const searchResult =
search.length === 0
? ""
: searchValue === 0
? "Fehlt"
: searchValue === 1
? "Vorhanden"
: "Doppelt";

const logout = async () => {
await supabase.auth.signOut();
setUser(null);
};

const duplicateStickers =
Object.entries(stickers)
.filter(
([_, value]) =>
value === 2
)
.map(([id]) => id);

const missingStickers =
  countries.flatMap((country) =>
    Array.from(
      { length: 20 },
      (_, i) => {
        const id = `${country.code}${i + 1}`;

        return (stickers[id] || 0) === 0
          ? id
          : null;
      }
    ).filter(
      (id): id is string =>
        id !== null
    )
  );

const copyTradeList = () => {};



const resetCollection =
() => {
const confirmed =
window.confirm(
"Möchtest du wirklich alle Sticker zurücksetzen?"
);


if (!confirmed)
  return;

setStickers({});

localStorage.removeItem(
  "panini-stickers"
);

setShowDuplicates(
  false
);

setShowMissing(
  false
);


};

const visibleCountries =
filter === "favoriten"
? countries.filter(
(country) =>
favorites.includes(
country.code
)
)
: countries;

    if (!user) {
  return (
  <main className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2">
          <span
            className={`${caveat.className} text-emerald-500 text-4xl rotate-[-4deg]`}
          >
            Mein
          </span>

          <h1 className="text-4xl font-bold text-zinc-900">
            Sticker-Tracker
          </h1>
        </div>

        <p className="text-zinc-500 mt-3">
          Verwalte deine Sammlung
          und tausche mit Freunden.
        </p>
      </div>

      <Auth />
    </div>
  </main>
);
}
  return (
    <main className="min-h-screen bg-zinc-100 p-4 md:p-8 max-w-7xl mx-auto">
      <Stats
        collected={collected}
        total={totalStickers}
        duplicates={duplicates}
      />
   
      <div className="sticky top-2 z-10 bg-white/90 backdrop-blur rounded-2xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
  <div>
    <h3 className="text-sm font-medium text-zinc-500 mb-2">
      Suche
    </h3>

    <Search
      search={search}
      setSearch={setSearch}
      result={searchResult}
    />
  </div>

  <div>
    <h3 className="text-sm font-medium text-zinc-500 mb-2">
      Tauschen
    </h3>

    <button
  onClick={() => router.push("/trade")}
  className="..."
>
  Tauschpartner finden
</button>
  </div>
</div>

        <div className="flex gap-2 flex-wrap mt-3">
          {[
  "alle",
  "fehlend",
  "vorhanden",
  "doppelt",
  "favoriten",
].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`action-button border ${
                filter === f
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>


      {visibleCountries.map((country) => (
      <CountrySection
        key={country.code}
        country={country}
        stickers={stickers}
        toggleSticker={toggleSticker}
        open={
        openCountries[country.code] ?? false
         }
        toggleCountry={toggleCountry}
        filter={filter}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
/>
      ))}

     <div className="mt-14 mb-6">
  
<div className="flex justify-center mb-6">
  <button
    onClick={() => setShowSettings(true)}
    className="action-button bg-zinc-900 text-white hover:bg-zinc-800"
  >
    Einstellungen
  </button>
</div>
 
  
</div>
      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        sortMode={sortMode}
        setSortMode={setSortMode}
        stickers={stickers}
        setStickers={setStickers}
        resetCollection={resetCollection}
        user={user}
        logout={logout}
/>
<div className="flex justify-center mb-6">
  <button
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    className="text-zinc-500 hover:text-zinc-800 transition"
  >
    ⬆️ Fahrstuhl
  </button>
</div>
</main>
);
}