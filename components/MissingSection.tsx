"use client";

import React from "react";

type Props = {
  showMissing: boolean;
  setShowMissing: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  missingStickers: string[];
};

export default function MissingSection({
  showMissing,
  setShowMissing,
  missingStickers,
}: Props) {
  return (
    <div className="mb-8">
      <button
        onClick={() =>
          setShowMissing((prev) => !prev)
        }
        className="w-full bg-white hover:bg-zinc-50 p-4 rounded-2xl shadow-sm flex justify-between items-center transition-all"
      >
        <span className="font-semibold text-black">
          {showMissing ? "▼" : "▶"} Fehlende Sticker
        </span>

        <span className="font-bold text-rose-500">
          {missingStickers.length}
        </span>
      </button>

      {showMissing && (
        <div className="mt-3 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex flex-wrap gap-2">
            {missingStickers.map((id) => (
              <span
                key={id}
                className="sticker-badge bg-rose-100 text-black"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}