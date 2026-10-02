"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function SubscriptionRedirect({ status }: { status: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if ((status === "PENDING" || status === "PAST_DUE") && pathname !== "/faculty/subscription") {
      router.push("/faculty/subscription");
    }
  }, [status, pathname, router]);

  return null;
}
