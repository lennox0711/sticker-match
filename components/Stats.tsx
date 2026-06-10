type StatsProps = {
  collected: number;
  total: number;
  duplicates: number;
};
import Image from "next/image";
import { Caveat } from "next/font/google";
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["700"],
});
export default function Stats({
  collected,
  total,
  duplicates,
}: StatsProps) {
  const missing = total - collected;

  const percentage = (
    (collected / total) *
    100
  ).toFixed(1);

 return (
  <>
  <div className="relative mb-2">
  <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 flex items-center justify-center gap-2">
  <span
    className={`${caveat.className} text-emerald-500 text-4xl rotate-[-4deg]`}
  >
    Mein
  </span>

  <span>
    Sticker-Tracker
  </span>
</h1>

     <p className="text-zinc-500 text-base md:text-lg mt-3 flex items-center justify-center">
  {collected} / {total} Sticker gesammelt
</p>
<p className="text-emerald-600 font-bold text-xl mt-1 flex items-center justify-center">
  {percentage}%
</p>
<div className="relative w-full mt-16 mb-10 overflow-visible">
  {/* Torwart */}
  <div className="absolute right-0 -top-24 opacity-90 z-0">
    <Image
      src="/goalkeeper.png"
      alt="Torwart"
      width={150}
      height={150}
      priority
    />
  </div>

  {/* Balken */}
  <div className="relative bg-zinc-200 rounded-full h-7 z-10">
    <div
      className="bg-emerald-500 h-7 rounded-full transition-all duration-700"
      style={{
        width: `${percentage}%`,
      }}
    />
  </div>

  {/* Ball */}
  <div
    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
    style={{
      left: `${percentage}%`,
    }}
  >
    <div className="relative w-16 h-16">
      <Image
        src="/football-new.png"
        alt="Fortschritt"
        fill
        className="object-contain"
        priority
      />
    </div>
  </div>
</div>
</div>

   <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-zinc-500 text-sm">
          Vorhanden
        </p>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />

          <p className="text-3xl font-bold text-zinc-800">
            {collected}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-zinc-500 text-sm">
          Fehlend
        </p>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-rose-400" />

          <p className="text-3xl font-bold text-zinc-800">
            {missing}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-zinc-500 text-sm">
          Doppelt
        </p>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />

          <p className="text-3xl font-bold text-zinc-800">
            {duplicates}
          </p>
        </div>
      </div>
    </div>
  </>
);
}