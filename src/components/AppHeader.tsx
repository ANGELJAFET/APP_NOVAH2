"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export function AppHeader() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <span className="font-semibold">Personas</span>
      <button type="button" onClick={handleLogout} className="text-sm text-gray-600 hover:underline">
        Cerrar sesión
      </button>
    </header>
  );
}
