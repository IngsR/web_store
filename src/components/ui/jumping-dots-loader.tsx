import { cn } from "@/lib/utils";

interface JumpingDotsLoaderProps {
  className?: string;
  dotClassName?: string;
}

export default function JumpingDotsLoader({ className, dotClassName }: JumpingDotsLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      <span className="sr-only">Loading...</span>
      <div className={cn("h-2 w-2 bg-primary rounded-full animate-jump", dotClassName)}></div>
      <div className={cn("h-2 w-2 bg-primary rounded-full animate-jump animation-delay-200", dotClassName)}></div>
      <div className={cn("h-2 w-2 bg-primary rounded-full animate-jump animation-delay-400", dotClassName)}></div>
    </div>
  );
}