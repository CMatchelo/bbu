import { User } from "../types/User";

export function saveGame(user: User) {
  const data = JSON.stringify(user, null, 2);
  const blob = new Blob([data], { type: "application/json " });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `save_${user.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
