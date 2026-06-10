"use client";

type Props = {
  country: {
    code: string;
    name: string;
  };
  stickers: Record<string, number>;
  toggleSticker: (id: string) => void;
  open: boolean;
  toggleCountry: (country: string) => void;
  filter: string;
  favorites: string[];
toggleFavorite: (country: string) => void;
};

export default function CountrySection({
  country,
  stickers,
  toggleSticker,
  open,
  toggleCountry,
  filter,
  favorites,
  toggleFavorite,
}: Props) {
  const progress = Array.from(
    { length: 20 },
    (_, i) => {
      const id = `${country.code}${i + 1}`;
      return stickers[id] || 0;
    }
  ).filter((v) => v > 0).length;

  const getColor = (value: number) => {
    switch (value) {
      case 1:
        return "bg-emerald-500";

      case 2:
        return "bg-amber-300";

      default:
        return "bg-zinc-100";
    }
  };

  const getProgressColor = () => {
    if (progress === 20) {
      return "text-emerald-700";
    }

    if (progress >= 15) {
      return "text-amber-500";
    }

    return "text-zinc-500";
  };

  const shouldShowSticker = (value: number) => {
    switch (filter) {
      case "fehlend":
        return value === 0;

      case "vorhanden":
        return value === 1;

      case "doppelt":
        return value === 2;

      default:
        return true;
    }
  };

  const visibleStickerCount = Array.from(
    { length: 20 },
    (_, i) => {
      const id = `${country.code}${i + 1}`;
      const value = stickers[id] || 0;

      return shouldShowSticker(value);
    }
  ).filter(Boolean).length;

  if (filter !== "alle" && visibleStickerCount === 0) {
    return null;
  }

  return (
    <div
      id={country.code}
      className="mb-4 bg-white rounded-2xl shadow-sm p-3"
    >
      <button
  onClick={() => toggleCountry(country.code)}
  className="w-full flex items-center justify-between rounded-xl px-4 py-3 bg-zinc-100 hover:bg-zinc-200 transition-all"
>
  <div className="flex items-center gap-3">
    <span
  onClick={(e) => {
    e.stopPropagation();
    toggleFavorite(country.code);
  }}
  className={`text-2xl cursor-pointer transition-all hover:scale-110 ${
    favorites.includes(country.code)
      ? "text-yellow-400"
      : "text-zinc-300"
  }`}
>
  ★
</span>

    <span className="font-semibold text-lg text-black">
      {open ? "▼" : "▶"} {country.name} ({country.code})
    </span>
  </div>

  <span
    className={`font-bold ${getProgressColor()}`}
  >
    {progress}/20
  </span>
</button>

      {open && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 mt-3">
          {Array.from({ length: 20 }, (_, i) => {
            const id = `${country.code}${i + 1}`;
            const value = stickers[id] || 0;

            if (!shouldShowSticker(value)) {
              return null;
            }

            return (
              <button
                key={id}
                onClick={() => toggleSticker(id)}
                className={`h-14 md:h-12 rounded-xl text-sm font-bold text-black border border-zinc-200 shadow-sm hover:scale-105 transition-all ${getColor(
                  value
                )}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}