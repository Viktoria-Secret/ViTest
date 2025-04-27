'use client'
import React from "react";

interface RankCardProps {
  label: string;
  onClick?: () => void;
}

export default function RankCard({ label, onClick }: RankCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center p-4 w-full text-left"
    >
      {/* Rank label */}
      <span className="font-medium text-gray-800">{label}</span>
    </button>
  );
} 