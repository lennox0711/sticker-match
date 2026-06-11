type SearchProps = {
  search: string;
  setSearch: (
    value: string
  ) => void;
};

export default function Search({
  search,
  setSearch,
}: SearchProps) {
  return (
    <input
      type="text"
      placeholder="GER12"
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      className="
        border
        rounded-lg
        p-3
        w-full
        text-black
      "
    />
  );
}