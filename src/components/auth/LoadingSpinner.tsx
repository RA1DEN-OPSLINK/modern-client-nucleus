import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-screen items-center justify-center bg-background", className)}>
      <motion.div 
        className="relative h-12 w-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </motion.div>
    </div>
  );
};