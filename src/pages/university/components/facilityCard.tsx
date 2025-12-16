type FacilityCardProps = {
  title: string;
  level?: number;
  description: string;
  onImprove: () => void;
};

export function FacilityCard({
  title,
  level,
  description,
  onImprove,
}: FacilityCardProps) {
  return (
    <div className="flex flex-col gap-2 border border-border  divide-y divide-highlights1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cardbglight">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold uppercase">
            {title}
          </span>
          {level !== undefined && (
            <span className="text-xs text-muted-foreground">Level {level}</span>
          )}
        </div>

        <button
          onClick={onImprove}
          className="text-xs uppercase px-3 py-1 
          bg-highlights1 rounded-sm shadow-2xl
          hover:bg-highlights1light transition"
        >
          Improve
        </button>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-muted-foreground px-4 py-2">
        {description}
      </p>
    </div>
  );
}
