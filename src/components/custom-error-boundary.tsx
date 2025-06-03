import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";

export default function CustomErrorBoundary({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <span className={cn("text-text-secondary text-sm", className)}>
          Unable to fetch!
        </span>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
