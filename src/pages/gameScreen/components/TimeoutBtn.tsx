interface TimeoutBtnProps {
  isPlayerHome: boolean;
  timeoutsRemaining: number;
  callTimeout?: () => void;
  classname?: string
}

export const TimeoutBtn = ({
  isPlayerHome,
  timeoutsRemaining,
  callTimeout,
  classname
}: TimeoutBtnProps) => {
  return (
    <div className={`min-w-50 ${classname}`}>
      <div className="flex flex-col">
        <span className="text-xs">Timeouts remaining: {timeoutsRemaining}</span>
        {isPlayerHome && timeoutsRemaining > 0 && (
          <button
            onClick={callTimeout}
            className={`
                p-1 rounded-xl shadow-2xl mt-2
                bg-highlights1 text-gray-700 hover:bg-highlights1light transition
              `}
          >
            CALL TIMEOUT
          </button>
        )}
      </div>
    </div>
  );
};
