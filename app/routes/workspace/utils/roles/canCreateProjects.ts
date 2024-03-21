import {UserRole} from "@prisma/client";
import {UserRoleLevels} from "./UserRoleLevels";

export const canCreateProjects = (role: UserRole) => {
  return UserRoleLevels[role] >= UserRoleLevels[UserRole.projectManager]
}