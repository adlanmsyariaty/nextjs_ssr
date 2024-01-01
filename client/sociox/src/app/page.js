import PostList from "@/app/components/PostList";
import CreatePost from "./components/CreatePost";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-teal-100">
      {/* Navigation bar */}
      <div className="flex bg-teal-500 h-[38px] w-full justify-center items-center fixed">
        <p className="text-center text-white text-[28px] font-bold">SocioX</p>
      </div>

      <div className=" bg-green-100 h-full sm:w-[750px] justify-center items-center mt-[38px] overflow-y-auto">
        <CreatePost />
        <PostList />
      </div>
    </main>
  );
}
