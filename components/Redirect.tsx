"use client";

import { useRouter } from "next/navigation";
export default function Redirect({ href }: { href: string }) {
  const router = useRouter();
  router.push(href);
  return null;
}
