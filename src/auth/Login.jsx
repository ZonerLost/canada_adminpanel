import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    navigate("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-slate-900 p-8 rounded w-80">
        <h2 className="text-xl mb-4">CuidadoLatino Canada — Login</h2>
        <input
          className="w-full p-2 mb-2 rounded bg-slate-800"
          placeholder="Email"
        />
        <input
          className="w-full p-2 mb-4 rounded bg-slate-800"
          placeholder="Password"
          type="password"
        />
        <button className="w-full py-2 bg-indigo-600 rounded">Sign in</button>
      </form>
    </div>
  );
}
