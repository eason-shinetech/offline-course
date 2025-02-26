import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
  return (
    <form className="relative m-8 w-full md:w-[600px]">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索..."
          className="w-full p-4 rounded-full text-zinc-700 dark:text-zinc-200 bg-slate-200 dark:bg-slate-900"
        />
        <button className="text-slate-700 dark:text-slate-200 absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full hover:bg-slate-100">
          <AiOutlineSearch className="h-6 w-auto" />
        </button>
      </div>
    </form>
  );
}
