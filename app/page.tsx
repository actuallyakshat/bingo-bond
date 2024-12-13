import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-[#f5f5f5]">
      <div className="mx-auto max-w-screen-xl px-4 py-32 flex min-h-screen h-full items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            Save Plans in a Bingo Card
            <strong className="block font-extrabold mt-1 text-primary sm:block">
              Make Memories with Friends
            </strong>
          </h1>

          <p className="mt-4 font-medium text-muted-foreground sm:text-lg/relaxed">
            Bingo Bond allows you to create bingo cards of plans with your
            friends so that you can enjoy time with your loved ones, one
            activity at a time.
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <SignedIn>
                <Link
                  className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-700 sm:w-auto"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <Link
                  className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-700 sm:w-auto"
                  href="/sign-in"
                >
                  Get Started
                </Link>
              </SignedOut>

              <Link
                className="block w-full rounded px-12 py-3 text-sm font-medium shadow text-primary hover:text-rose-700 focus:outline-none focus:ring sm:w-auto"
                href="www.github.com/actuallyakshat/bingo-bond"
              >
                Github
              </Link>
            </div>
            <Link
              href={"/how-to-use"}
              className="rounded w-full max-w-xs text-sm hover:underline font-medium text-primary"
            >
              How to Use Bingo Bond?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
