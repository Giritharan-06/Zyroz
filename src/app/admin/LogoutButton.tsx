"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()}
      className="px-5 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium rounded-lg transition-colors"
    >
      Sign Out
    </button>
  );
}
