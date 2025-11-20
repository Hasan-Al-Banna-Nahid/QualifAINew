"use client";

import { useEffect, useState } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const [stackLines, setStackLines] = useState<string[]>([]);

  useEffect(() => {
    if (error.stack) {
      setStackLines(error.stack.split("\n"));
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="mb-2 text-lg font-semibold text-red-700">
        Error: {error.name} – {error.message}
      </p>

      <div className="bg-white shadow-md rounded p-4 max-w-3xl w-full overflow-auto">
        <h2 className="text-xl font-bold mb-2">Stack Trace:</h2>
        <pre className="text-sm text-gray-800">
          {stackLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </pre>
      </div>

      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
