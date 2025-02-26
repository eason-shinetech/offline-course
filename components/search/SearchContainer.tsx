import Container from "../web-layout/Container";
import SearchBar from "./SearchBar";

export default function SearchContainer() {
  return (
    <Container className="max-w-full rounded-xl mt-4 w-full h-[300px]  flex flex-col items-center justify-center text-white bg-gradient-to-r from-cyan-500 to-blue-400 dark:bg-gradient-to-r dark:from-slate-600 dark:to-zinc-500">
      <SearchBar />
      <div className="text-bold">
        热门搜索：Unreal Engine，Unity3D，Godot，Blender，React, Nextjs,
        Tailwindcss...
      </div>
    </Container>
  );
}
