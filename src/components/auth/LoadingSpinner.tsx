import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-screen items-center justify-center bg-background", className)}>
      <motion.div 
        className="relative h-16 w-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
      </motion.div>
    </div>
  );
};