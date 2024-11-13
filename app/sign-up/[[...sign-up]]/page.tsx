import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[100dvh]">
      <SignUp />;
    </div>
  );
}
