import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-screen items-center justify-center bg-background/50", className)}>
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-2 border-primary opacity-20"></div>
      </div>
    </div>
  );
};