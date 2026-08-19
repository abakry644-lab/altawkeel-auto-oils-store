import { timingSafeEqual } from "node:crypto";

function normalizeConfiguredPassword(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed.at(-1);
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

export function isRailwayAdminPasswordValid(password: string): boolean {
  const configured = normalizeConfiguredPassword(process.env.RAILWAY_ADMIN_PASSWORD ?? "");
  const supplied = password.trim();
  if (!configured || !supplied) return false;
  const suppliedBuffer = Buffer.from(supplied);
  const configuredBuffer = Buffer.from(configured);
  if (suppliedBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(suppliedBuffer, configuredBuffer);
}
