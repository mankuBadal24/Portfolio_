import { cn } from "@/lib/utils";

export default function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand/10 text-brand px-3 py-1 text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}
