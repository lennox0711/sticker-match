"use client";

type Props = {
  showDuplicates: boolean;
  setShowDuplicates: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  duplicates: number;
  duplicateStickers: string[];
  copyTradeList: () => void;
};

export default function TradeSection({
  showDuplicates,
  setShowDuplicates,
  duplicates,
  duplicateStickers,
  copyTradeList,
}: Props) {
  return (
    <>
       <div className="mb-6">
        <button
          onClick={() =>
            setShowDuplicates((prev) => !prev)
          }
          className="w-full bg-white hover:bg-zinc-50 p-4 rounded-2xl shadow-sm flex justify-between items-center transition-all"
        >
          <span className="font-semibold text-black">
            {showDuplicates ? "▼" : "▶"} Tauschbare Sticker
          </span>

          <span className="font-bold text-amber-500">
            {duplicates}
          </span>
        </button>

        {showDuplicates && (
          <div className="mt-3 bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap gap-2">
              {duplicateStickers.length > 0 ? (
                duplicateStickers.map((id) => (
                  <span
                    key={id}
                    className="sticker-badge bg-amber-100 text-black"
                  >
                    {id}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500">
                  Keine Dubletten vorhanden
                </span>
              )}
            </div>

            <button
              onClick={copyTradeList}
              className="action-button bg-emerald-500 text-white hover:bg-emerald-600 mt-4"
            >
              Tauschliste kopieren
            </button>
          </div>
        )}
      </div>
    </>
  );
}