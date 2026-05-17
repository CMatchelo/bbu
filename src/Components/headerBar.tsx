import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { SeasonTimeline } from "./SeasonTimeline";

export const HeaderBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-mainbgdark border-b border-highlights1 flex flex-col">
      {/* Top row: university info + coach name + next game button */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-text1 truncate">
            {user?.currentUniversity.name}{" "}
            <span className="text-highlights1">{user?.currentUniversity.nickname}</span>
          </h2>
          <span className="text-text2/40 text-xs shrink-0">—</span>
          <h3 className="text-xs text-text2 truncate">{user?.name}</h3>
        </div>
        <button
          onClick={() => navigate("teamSelection")}
          className="px-5 py-2 text-black text-sm font-semibold bg-highlights1 hover:bg-highlights1dark shadow-md shrink-0 ml-4"
        >
          Next Game
        </button>
      </div>

      {/* Timeline row: full width, no horizontal padding */}
      <div className="px-2 pb-1.5">
        <SeasonTimeline />
      </div>
    </div>
  );
};
