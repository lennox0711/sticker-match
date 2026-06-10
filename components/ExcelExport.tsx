"use client";

import * as XLSX from "xlsx";

type Props = {
  stickers: Record<string, number>;
};

export default function ExcelExport({
  stickers,
}: Props) {
  const exportExcel = () => {
    const rows = Object.entries(stickers).map(
      ([id, value]) => {
        const country = id.replace(/[0-9]/g, "");
        const number = id.replace(/\D/g, "");

        return {
          ID: id,
          Land: country,
          Nummer: number,
          Status:
            value > 0
              ? "Vorhanden"
              : "",
          Doppelt:
            value === 2 ? "x" : "",
        };
      }
    );

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Schnellsuche"
    );

    XLSX.writeFile(
      workbook,
      "Panini-Export.xlsx"
    );
  };

  return (
    <button
      onClick={exportExcel}
    className="w-full px-4 py-2 rounded-xl text-sm font-medium transition-all text-zinc-700 hover:bg-zinc-200 text-center"
    >
      Export
    </button>
  );
}