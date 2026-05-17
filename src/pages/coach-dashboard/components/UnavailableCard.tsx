import { Player } from "../../../types/Player";
import { Icons } from "../../../utils/icons";
import { DashboardCard } from "./DashboardCard";

export function UnavailableCard({ players }: { players: Player[] }) {
  const unavailable = players.filter((p) => p.injured || p.grades < 70);

  return (
    <DashboardCard title="Unavailable Players">
      {unavailable.length === 0 ? (
        <p className="text-[12px] text-highlights1/70 font-medium">All players available.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {unavailable.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="w-4 h-4 shrink-0">
                {p.injured ? Icons.MedicalSymbol : Icons.AcademicWarning}
              </span>
              <span className="text-[12px] text-text1 font-medium">
                {p.firstName} {p.lastName}
              </span>
              <span className="text-[10px] text-text2/60 ml-auto">{p.inCourtPosition}</span>
              <span className="text-[10px] text-text2/50">
                {p.injured ? "Injured" : `Grades ${p.grades}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
