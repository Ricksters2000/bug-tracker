import {UserRole} from "@prisma/client";
import {UserRoleLevels} from "./UserRoleLevels";

export const canCreateAndEditUsers = (role: UserRole) => {
  return UserRoleLevels[role] >= UserRoleLevels[UserRole.admin]
}