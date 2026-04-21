export const toRecord = <T extends { id: string }>(arr: T[]) =>
    Object.fromEntries(arr.map((i) => [i.id, i]));