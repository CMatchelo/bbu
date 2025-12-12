import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export const HeaderBar = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  return (
    <div className="w-full bg-mainbgdark border-b border-highlights2 p-4 flex flex-col items-start mb-4 relative">
      <h2>
        {user?.currentUniversity.name} {user?.currentUniversity.nickname}
      </h2>
      <h3>{user?.name}</h3>
      <button onClick={() => navigate("teamSelection")}
        className="px-5 text-black absolute right-0 inset-y-0
               bg-highlights2 hover:bg-highlights2dark shadow-2xl"
      >
        Next week
      </button>
    </div>
  );
};
