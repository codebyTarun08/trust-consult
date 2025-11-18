"use client"
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login"); // 👈 kick out instantly
    }
  }, [token, router]);

  return <>{children}</>;
}
