export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}
