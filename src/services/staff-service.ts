import "server-only";

import { compare } from "bcryptjs";

import { StaffUser } from "@/database/models/staff-user";
import { ensureDatabase } from "@/database/sequelize";
import type { StaffSession } from "@/features/admin/types";
import { UnauthorizedError } from "@/lib/api/errors";

export async function authenticateStaff(email: string, password: string): Promise<StaffSession> {
  await ensureDatabase();
  const user = await StaffUser.findOne({
    where: { email: email.trim().toLowerCase() },
  });
  if (!user) {
    throw new UnauthorizedError("Email or password is not correct.");
  }
  const ok = await compare(password, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError("Email or password is not correct.");
  }
  return {
    email: user.email,
    name: user.name,
    role: "SUPER_ADMIN",
  };
}
