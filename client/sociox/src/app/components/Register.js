"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
  });

  const router = useRouter();

  function showModal() {
    document.getElementById("register").showModal();
  }

  async function register() {
    try {
      const res = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          phoneNumber,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw data.message;
      }

      const otpRes = await fetch(`http://localhost:3000/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });
      const otpData = await otpRes.json();
      if (!otpData.success) {
        throw otpData.message;
      }

      document.getElementById("verification").showModal();
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: error,
        timer: 2500,
      });
    } finally {
      setUsername("");
      setPassword("");
      router.refresh();
    }
  }

  async function verify() {
    try {
      const verifyRes = await fetch(`http://localhost:3000/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          otp,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw verifyData.message;
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: error,
        timer: 2500,
      });
    } finally {
      setPhoneNumber("");
      setOtp("");
      router.refresh();
    }
  }

  return (
    <>
      <p
        className={
          "text-center text-white text-[16px] font-bold cursor-pointer " +
          (isLoggedIn ? "hidden" : "")
        }
        onClick={showModal}
      >
        Register
      </p>
      <dialog id="register" className="modal">
        <div className="modal-box w-11/12 max-w-[400px]">
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
          <input
            className="w-full p-3 bg-emerald-50 rounded-xl outline-none display scroll-m-0 border-emerald-200 border-2 mt-4"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={register}>
                Register
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="verification" className="modal">
        <div className="modal-box w-11/12 max-w-[400px]">
          <p className="mb-2">We send OTP Code to your number</p>
          <input
            className="w-full p-3 bg-emerald-50 rounded-xl outline-none display scroll-m-0 border-emerald-200 border-2 mt-4"
            placeholder="OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={verify}>
                Verify
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
