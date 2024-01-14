import {$Enums} from "@prisma/client";
import {db} from "./db";

export type UserPublic = {
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  role: $Enums.UserRole;
}

export const findUserById = async (id: number): Promise<UserPublic | null> => {
  const user = await db.user.findUnique({
    select: {
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      bio: true,
    },
    where: {
      id,
    }
  })
  return user
}

export const authenticateUser = async (email: string, password: string): Promise<number | null> => {
  const user = await db.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
      password,
    },
  })
  if (!user) {
    return null
  }
  return user.id
}