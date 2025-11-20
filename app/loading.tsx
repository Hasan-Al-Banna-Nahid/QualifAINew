"use client";

import { IoPieChartOutline } from "react-icons/io5";

export default function Loading() {
  return (
    // Full screen overlay, fixed on top of everything
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
      <div className="relative w-24 h-24">
        {/* Spinner blocks with glow */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <IoPieChartOutline className="w-20 h-20 text-pink-500 drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow delay-200">
          <IoPieChartOutline className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow delay-400">
          <IoPieChartOutline className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
        </div>
      </div>
    </div>
  );
}
