import {UserRole} from "@prisma/client"

export type RoleDescription = {
  roles: Array<UserRole>;
  description: string;
}

export const roleDescriptions: Array<RoleDescription> = [
  {
    roles: [UserRole.admin],
    description: `Create and edit users`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager],
    description: `Create new projects`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager],
    description: `View all created projects (including archived)`,
  },
  {
    roles: [UserRole.admin, UserRole.projectManager],
    description: `View extra analytical data from projects`,
  },
  {
    roles: [UserRole.admin, UserRole.developer, UserRole.projectManager, UserRole.submitter],
    description: `Create and edit tickets`,
  },
  {
    roles: [UserRole.admin, UserRole.developer, UserRole.projectManager, UserRole.submitter],
    description: `View all tickets from projects`
  }
]