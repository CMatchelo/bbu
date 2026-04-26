import { useEffect, useState } from "react";
import NewGame from "./Components/newGame";
import { LoadGame } from "./Components/loadGame";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../utils/icons";

export default function MainScreen() {
  const [savesIds, setSavesId] = useState<string[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGame = async () => {
      const folders = await window.api.loadFolders();
      setSavesId(folders);
    };
    loadGame();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/team");
    }
  }, [user, navigate]);

  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);

  const openNewScreen = () => {
    setIsLoad(false);
    setIsNew(true);
  };

  const openLoadScreen = () => {
    setIsLoad(true);
    setIsNew(false);
  };

  const backMenu = () => {
    setIsLoad(false);
    setIsNew(false);
  };

  const isRoot = !isLoad && !isNew;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/mainMenuBg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-mainbgdark/70 backdrop-blur-sm" />

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-fit">
          {/* Logo / Title area */}
          {isRoot && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black tracking-tight text-text1 uppercase">
                Uni<span className="text-highlights1">Basket Brasil</span>
              </h1>
              <p className="text-text2 text-sm mt-1 tracking-widest uppercase">
                University Basketball
              </p>
            </div>
          )}

          <div className="bg-cardbg border border-cardbglight/40 p-8 rounded-2xl shadow-2xl shadow-black/60 min-w-[320px] flex flex-col gap-3">
            {isRoot && (
              <>
                <button
                  onClick={openNewScreen}
                  className="
                    w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-widest
                    bg-highlights1 text-mainbgdark
                    hover:bg-highlights1light
                    active:bg-highlights1dark
                    transition-colors duration-150 shadow-lg shadow-highlights1/20
                  "
                >
                  Novo jogo
                </button>
                <button
                  onClick={openLoadScreen}
                  className="
                    w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-widest
                    bg-cardbglight text-text1
                    hover:bg-cardbgdark border border-cardbglight
                    active:bg-mainbglight
                    transition-colors duration-150
                  "
                >
                  Carregar jogo
                </button>
              </>
            )}

            {!isRoot && (
              <button
                onClick={backMenu}
                className="
                  flex items-center gap-2 text-text2 text-sm
                  hover:text-text1 transition-colors duration-150 mb-1 w-fit
                "
              >
                {Icons.IconBack}
                Voltar
              </button>
            )}

            {!isLoad && isNew && <NewGame />}
            {isLoad && !isNew && <LoadGame saveIds={savesIds} />}
          </div>
        </div>
      </div>
    </div>
  );
}
