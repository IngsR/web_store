
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-solid",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export default function Spinner({ size, className }: SpinnerProps) {
  return (
    <div
      className={cn(
        spinnerVariants({ size }),
        "border-primary border-t-transparent",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
