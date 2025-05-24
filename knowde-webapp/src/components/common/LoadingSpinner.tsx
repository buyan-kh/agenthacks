import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-kn-background">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-kn-primary`}
      />
      {message && (
        <p className="mt-4 text-kn-text-secondary text-lg">{message}</p>
      )}
    </div>
  );
}
