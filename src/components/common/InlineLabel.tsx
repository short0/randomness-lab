import { cn } from "@/lib/utils";

export function InlineLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
      className,
    )}>
      {children}
    </span>
  );
}
