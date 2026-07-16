import { useTranslation } from "react-i18next";
import { MatchNews } from "../../../types/MatchNews";
import { University } from "../../../types/University";
import { Player } from "../../../types/Player";
import { PlayerAvatar } from "../../../Components/PlayerAvatar";
import { Icons } from "../../../utils/icons";
import { getNewsPostText, getNewsComments } from "../../../utils/newsSocial";

interface NewsPostProps {
  item: MatchNews;
  universities: University[];
  players: Player[];
  onReadMore: () => void;
}

export function NewsPost({
  item,
  universities,
  players,
  onReadMore,
}: NewsPostProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const postText = getNewsPostText(item, lang, universities);
  const comments = getNewsComments(item, lang, universities, players);

  return (
    <div className="flex flex-col shrink-0 rounded-lg border border-highlights1/12 bg-mainbgdark overflow-hidden">
      <div className="flex flex-col gap-2.5 px-4 py-3.5">
        <div className="flex flex-row items-start gap-2.5">
          <PlayerAvatar seed={item.reporterHandle} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-text1 text-left">
              {item.reporterHandle}
            </div>
            <div className="text-[13px] text-text1 text-left">
              {postText.trimStart()}{" "}
              <button
                onClick={onReadMore}
                className="text-highlights1 hover:underline font-medium"
              >
                {t("newsLocale.readMore")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-text2">
            <div className="w-3.5 h-3.5">{Icons.heart}</div>
            <span className="text-[11px]">{item.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text2">
            <div className="w-3.5 h-3.5">{Icons.comment}</div>
            <span className="text-[11px]">{comments.length}</span>
          </div>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="flex flex-col border-t border-highlights1/10 bg-black/10">
          {comments.map((comment, i) => (
            <div key={i} className="flex gap-2.5 px-4 py-2.5 pl-6 relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-highlights1/15" />
              <PlayerAvatar seed={comment.username} size={28} />
              <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                <p className="text-[11.5px] text-text2">
                  <span className="font-semibold text-text1">
                    {comment.username}
                  </span>{" "}
                  {comment.text}
                </p>
                <div className="flex items-center gap-1 text-text2 opacity-60">
                  <div className="w-3 h-3">{Icons.heart}</div>
                  <span className="text-[10px]">{comment.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
