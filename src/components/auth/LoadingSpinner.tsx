import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-screen items-center justify-center bg-background", className)}>
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-2 border-primary opacity-20"></div>
      </motion.div>
    </div>
  );
};