import {$Enums, Prisma} from "@prisma/client";
import {db} from "./db";

export type UserPublic = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  role: $Enums.UserRole;
}

export const userPublicSelectInput = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  bio: true,
})

export const findUserById = async (id: number): Promise<UserPublic | null> => {
  const user = await db.user.findUnique({
    select: userPublicSelectInput,
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