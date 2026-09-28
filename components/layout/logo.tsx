import { cn } from "@/lib/utils";

/**
 * The mark is two angled bars in ascending step — a simple, literal
 * reading of "Techlance" (an advancing lance/blade) that also doubles as
 * a progress motif appropriate to a learning platform. Kept as flat
 * geometry (no gradients) so it stays crisp at small sizes and reads
 * cleanly in both themes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M9 20.5 16 9l3.2 5.6-4.6 8Z"
        className="fill-primary-foreground"
        opacity="0.55"
      />
      <path d="M14.8 22.5 21.5 11l3 5.3-4.9 8.9Z" className="fill-primary-foreground" />
    </svg>
  );
}

export function Logo({
  className,
  subtitle = true,
}: {
  className?: string;
  subtitle?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
          Techlance
        </span>
        {subtitle && (
          <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground">
            Academy
          </span>
        )}
      </span>
    </span>
  );
}
