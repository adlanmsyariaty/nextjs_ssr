"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Logout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
  });

  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    router.refresh();
  }

  return (
    <p
      className={
        "text-center text-white text-[16px] font-bold ml-4 " +
        (isLoggedIn ? "" : "hidden")
      }
      onClick={logout}
    >
      Logout
    </p>
  );
}
