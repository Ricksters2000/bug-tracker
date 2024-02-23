import {UserRole} from "@prisma/client"

export type RoleDescription = {
  roles: Array<UserRole>;
  description: string;
}

export const roleDescriptions: Array<RoleDescription> = [
  {
    roles: [UserRole.admin],
    description: `Admin`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager],
    description: `Admin, project`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager, UserRole.developer],
    description: `Admin, project, developer`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager, UserRole.submitter],
    description: `Admin, project, submitter`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager],
    description: `Admin, project`,
  },
]