import Link from "next/link";
import React from "react";

export default function Unauthorised() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen">
      <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
        Hold On Buddy
      </h1>
      <p className="text-lg">You are not authorized to access this page.</p>
      <Link className="text-primary hover:underline" href="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );
}
