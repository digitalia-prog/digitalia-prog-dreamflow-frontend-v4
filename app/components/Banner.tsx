"use client";

export default function Banner({text}: {text: string}) {
  return (
    <div className="w-full bg-purple-600 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-2 text-sm font-semibold">
        {text}
      </div>
    </div>
  );
}

