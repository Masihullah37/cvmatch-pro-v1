"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSync() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const isSuccess = url.searchParams.get("payment") === "success";

    if (!isSuccess) return;

    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const res = await fetch("/api/user/credits", { cache: "no-store" });
      const data = await res.json();

      if (data.credits > 0 || attempts > 10) {
        clearInterval(interval);
        router.refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
