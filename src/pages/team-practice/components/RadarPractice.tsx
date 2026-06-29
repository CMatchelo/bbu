import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { RadarData } from "../../../types/RadarData";

interface RadarCustomProps {
  radarDataList: RadarData[];
  title?: string;
}

export default function RadarCustom({
  radarDataList,
  title,
}: RadarCustomProps) {
  return (
    <div className="p-4">
      {title && (
        <div className="text-xl font-bold">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={160}>
        <RadarChart data={radarDataList}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar
            dataKey="value"
            stroke="#00D084"
            fill="#00D084"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
