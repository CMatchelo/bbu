// components/Pill.tsx
type PillVariant = "green" | "yellow" | "muted";

interface PillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  rounded?: boolean;
}

const variants: Record<PillVariant, string> = {
  green:  "text-highlights1 bg-highlights1/10 border-highlights1/25",
  yellow: "text-highlights2 bg-highlights2/10 border-highlights2/25",
  muted:  "text-text2 bg-white/[0.04] border-white/[0.08]",
};

export function Pill({ children, variant = "green", rounded = false }: PillProps) {
  return (
    <span
      className={`text-[10px] min-w-20 font-medium border px-1.5 py-0.5 tracking-wider ${variants[variant]} ${
        rounded ? "rounded-full" : "rounded"
      }`}
    >
      {children}
    </span>
  );
}