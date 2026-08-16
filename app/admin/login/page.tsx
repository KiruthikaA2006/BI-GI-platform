"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding/organization");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#e4dac9] flex items-center justify-center p-6 text-stone-700 font-medium text-xs">
      Redirecting to Organization Selection Page...
    </div>
  );
}
