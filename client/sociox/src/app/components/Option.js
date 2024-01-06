"use client";

import { useEffect, useState } from "react";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";

export default function Modal({ post }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
    setAccessToken(token);
  });

  return (
    <>
      <div className={"dropdown dropdown-end " + (isLoggedIn ? "" : "hidden")}>
        <div tabIndex={0} role="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow-lg rounded-box w-40 bg-teal-50"
        >
          <UpdatePost post={post} accessToken={accessToken} />
          <DeletePost postId={post.id} accessToken={accessToken} />
        </ul>
      </div>
    </>
  );
}
