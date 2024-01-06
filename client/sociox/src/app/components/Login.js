"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
  });

  const router = useRouter();

  function showModal() {
    document.getElementById("login").showModal();
  }

  async function login() {
    try {
      const res = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw data.message;
      }

      localStorage.setItem("token", data.data.accessToken);
    } catch (error) {
      console.log(error);
    } finally {
      setUsername("");
      setPassword("");
      router.refresh();
    }
  }

  return (
    <>
      <p
        onClick={showModal}
        className={
          "text-center text-white text-[16px] font-bold mr-4 " +
          (isLoggedIn ? "hidden" : "")
        }
      >
        Login
      </p>
      <dialog id="login" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <input
            className="w-full p-3 bg-emerald-50 rounded-xl outline-none display scroll-m-0 border-emerald-200 border-2 mt-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 bg-emerald-50 rounded-xl outline-none display scroll-m-0 border-emerald-200 border-2 mt-4"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={login}>
                Login
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
