// components/Pill.tsx
type PillVariant = "green" | "yellow" | "muted";

interface PillProps {
  children: React.ReactNode;
  className?: string;
  variant?: PillVariant;
  rounded?: boolean;
}

const variants: Record<PillVariant, string> = {
  green:  "text-highlights1 bg-highlights1/10 border-highlights1/25",
  yellow: "text-highlights2 bg-highlights2/10 border-highlights2/25",
  muted:  "text-text2 bg-white/[0.04] border-white/8",
};

export function Pill({ children, className, variant = "green", rounded = false }: PillProps) {
  return (
    <span
      className={`text-[10px] font-medium border px-1.5 py-0.5 tracking-wider ${className} ${variants[variant]} ${
        rounded ? "rounded-full" : "rounded"
      }`}
    >
      {children}
    </span>
  );
}