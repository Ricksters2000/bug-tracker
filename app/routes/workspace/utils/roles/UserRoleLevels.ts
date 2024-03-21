import {UserRole} from "@prisma/client";

export const UserRoleLevels: Record<UserRole, number> = {
  [UserRole.admin]: 4,
  [UserRole.projectManager]: 3,
  [UserRole.developer]: 2,
  [UserRole.submitter]: 1,
}