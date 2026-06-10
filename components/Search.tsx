type SearchProps = {
  search: string;
  setSearch: (value: string) => void;
  result: string;
};

export default function Search({
  search,
  setSearch,
  result,
}: SearchProps) {
  return (
    <div className="mb-10">
      

      <input
        type="text"
        placeholder="GER12"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border rounded-lg p-3 w-64 text-black"
      />

      <div className="mt-3 text-xl text-black font-semibold">
        {result}
      </div>
    </div>
  );
}