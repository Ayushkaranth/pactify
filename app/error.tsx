// app/error.tsx
"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="mt-4 text-gray-400">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}
