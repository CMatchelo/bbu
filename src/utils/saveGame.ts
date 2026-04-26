import { selectAllPlayers, selectAllUniversities } from "../selectors/data.selectors";
import { store } from "../store";
import { toRecord } from "./toRecord";

export async function savePlayers(folderName: string) {
  const players = selectAllPlayers(store.getState());
  await window.api.savePlayers(folderName, toRecord(players));
}

export async function saveUniversities(folderName: string) {
  const universities = selectAllUniversities(store.getState());
  await window.api.saveUniversities(folderName, toRecord(universities));
}
