const MAX_LEVEL = 5;

export function LevelPips({ level = 0 }: { level?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <div
          key={i}
          className={`w-[18px] h-1 rounded-full transition-colors ${
            i < level
              ? level >= 4
                ? "bg-highlights1light"
                : level <= 2
                ? "bg-highlights1dark"
                : "bg-highlights1"
              : "bg-white/8"
          }`}
        />
      ))}
    </div>
  );
}