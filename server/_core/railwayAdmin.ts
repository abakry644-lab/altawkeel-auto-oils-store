import { timingSafeEqual } from "node:crypto";

export function isRailwayAdminPasswordValid(password: string): boolean {
  const configured = process.env.RAILWAY_ADMIN_PASSWORD ?? "";
  if (!configured || !password) return false;
  const suppliedBuffer = Buffer.from(password);
  const configuredBuffer = Buffer.from(configured);
  if (suppliedBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(suppliedBuffer, configuredBuffer);
}
