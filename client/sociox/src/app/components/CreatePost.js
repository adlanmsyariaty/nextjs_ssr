"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function submitPost(e) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username ? username : "anonymous",
          message: message,
        }),
      });
      const data = await res.json();
      if (!data.status) {
        throw data.message;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMessage("");
      setUsername("");
      router.refresh();
    }
  }

  return (
    <div className="flex bg-emerald-100 w-full h-[140px] p-2">
      <div className="w-[10%] p-2">
        <img
          src="/blank-profile-picture-973460_1280.png"
          alt="default-profile-picture"
          width="500"
          height="500"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col w-[90%]">
        <div className="flex h-full">
          <textarea
            className="w-full p-3 resize-none bg-emerald-50 rounded-xl outline-none display scroll-m-0"
            placeholder="What is happening?!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex h-14 justify-between mt-2">
          <input
            className="outline-none pl-3 bg-emerald-50 rounded-xl w-40"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-2 rounded-xl"
            onClick={submitPost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
