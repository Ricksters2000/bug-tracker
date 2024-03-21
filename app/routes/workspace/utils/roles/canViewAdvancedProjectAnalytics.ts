import {UserRole} from "@prisma/client";
import {UserRoleLevels} from "./UserRoleLevels";

export const canViewAdvancedProjectAnalytics = (role: UserRole) => {
  return UserRoleLevels[role] >= UserRoleLevels[UserRole.projectManager]
}