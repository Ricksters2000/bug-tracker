import {UserRole} from "@prisma/client";
import {UserRoleLevels} from "./UserRoleLevels";

export const canViewAllProjects = (role: UserRole) => {
  return UserRoleLevels[role] >= UserRoleLevels[UserRole.projectManager]
}