"use client";

import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

type Props = {
  setStickers: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  user: any;
};

export default function ExcelImport({
  setStickers,
  user,
}: Props) {
  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    const sheet =
      workbook.Sheets["Schnellsuche"];

    if (!sheet) {
      alert(
        "Reiter 'Schnellsuche' nicht gefunden."
      );
      return;
    }

    const rows = XLSX.utils.sheet_to_json(
      sheet,
      {
        header: 1,
      }
    ) as any[][];

    const imported: Record<
      string,
      number
    > = {};

    rows.forEach((row) => {
      const id = row[0];
      const status = row[3];
      const doppelt = row[4];

      if (!id) return;

      if (doppelt) {
        imported[id] = 2;
      } else if (
        status === "Vorhanden"
      ) {
        imported[id] = 1;
      }
    });

    setStickers(imported);

if (user) {
  await supabase
    .from("stickers")
    .delete()
    .eq("user_id", user.id);

  const rows = Object.entries(
    imported
  ).map(([sticker_id, value]) => ({
    user_id: user.id,
    sticker_id,
    value,
  }));

  if (rows.length > 0) {
    const { error } =
      await supabase
        .from("stickers")
        .insert(rows);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
  }
}

alert(
  `${Object.keys(imported).length} Sticker importiert`
);
  };

return (
  <>
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFile}
      className="hidden"
      id="excel-upload"
    />

    <button
      onClick={() => {
        document
          .getElementById("excel-upload")
          ?.click();
      }}
      className="w-full px-4 py-2 rounded-xl text-sm font-medium transition-all text-zinc-700 hover:bg-zinc-200"
    >
      Import
    </button>
  </>
);
}