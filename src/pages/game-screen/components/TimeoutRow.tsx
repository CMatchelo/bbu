import { TimeoutBtn } from "./TimeoutBtn";

interface TimeoutRowProps {
  isPlayerHome: boolean;
  userTimeouts: number;
  cpuTimeouts: number;
  onCallTimeout: () => void;
  children: React.ReactNode;
}

/**
 * Wraps the scoreboard with timeout buttons on either side.
 * Handles the left = home, right = away layout, and which
 * side belongs to the user vs. CPU — decoupled from TimeoutBtn itself.
 */
export function TimeoutRow({
  isPlayerHome,
  userTimeouts,
  cpuTimeouts,
  onCallTimeout,
  children,
}: TimeoutRowProps) {
  const homeTimeouts = isPlayerHome ? userTimeouts : cpuTimeouts;
  const awayTimeouts = isPlayerHome ? cpuTimeouts : userTimeouts;
  const homeIsUser = isPlayerHome;

  return (
    <div className="w-full flex flex-row gap-4 justify-center items-center mb-5">
      <TimeoutBtn
        isPlayerHome={homeIsUser}
        timeoutsRemaining={homeTimeouts}
        callTimeout={homeIsUser ? onCallTimeout : undefined}
        classname="self"
      />

      {children}

      <TimeoutBtn
        isPlayerHome={!homeIsUser}
        timeoutsRemaining={awayTimeouts}
        callTimeout={!homeIsUser ? onCallTimeout : undefined}
      />
    </div>
  );
}
