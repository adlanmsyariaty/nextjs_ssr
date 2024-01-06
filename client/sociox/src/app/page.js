import PostList from "@/app/components/PostList";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-teal-100">
      {/* Navigation bar */}
      <div className="flex bg-teal-500 h-[38px] w-full justify-between items-center fixed px-2">
        <div className="flex">
          <p className="text-center text-white text-[28px] font-bold">
            <i>SocioX</i>
          </p>
        </div>
        <div className="flex">
          <Login />
          <Register />
          <Logout />
        </div>
      </div>

      <div className=" bg-emerald-100 h-full w-full max-w-[750px] justify-center items-center mt-[38px] overflow-y-auto">
        <CreatePost />
        <PostList />
      </div>
    </main>
  );
}
