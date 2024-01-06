"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [file, setFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
    setAccessToken(token);
  });

  const router = useRouter();

  async function submitPost(e) {
    e.preventDefault();

    try {
      let filePath = null;
      if (file) {
        const uploadRes = await fetch(
          `http://localhost:3000/posts/presigned-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              access_token: accessToken,
            },
            body: JSON.stringify({
              fileType: file.type,
            }),
          }
        );
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw data.message;
        }

        let presignedUrl = uploadData.data.url;
        const result = await fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        filePath = uploadData.data.filePath;
      }

      const res = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: accessToken,
        },
        body: JSON.stringify({
          message: message,
          filePath: filePath,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw data.message;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMessage("");
      setFile(null);
      router.refresh();
    }
  }

  return (
    <div
      className={
        "flex bg-emerald-100 w-full h-[200px] p-2 " +
        (isLoggedIn ? "" : "hidden")
      }
    >
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
        <div className="flex h-20 justify-between mt-2 items-center">
          <div className="flex items-start flex-wrap">
            <input
              type="file"
              className="file-input w-[280px] max-w-x bg-emerald-50 mr-2 text-gray-400 h-[36px] my-1"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="flex h-full items-center">
            <button
              className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-3 rounded-xl h-[36px]"
              onClick={submitPost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
