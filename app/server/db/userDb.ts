import {$Enums, Company, Prisma} from "@prisma/client";
import {db} from "./db";
import {createUuid} from "~/utils/createUuid";

export type UserPublic = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  role: $Enums.UserRole;
}

export type UserPublicWithCompany = UserPublic & {
  company: Company;
}

export const userPublicSelectInput = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  bio: true,
})

export const findUserWithCompany = async (id: number): Promise<UserPublicWithCompany | null> => {
  const user = await db.user.findUnique({
    select: {
      ...userPublicSelectInput,
      company: true,
    },
    where: {id},
  })
  return user
}

export const findUserById = async (id: number): Promise<UserPublic | null> => {
  const user = await db.user.findUnique({
    select: userPublicSelectInput,
    where: {
      id,
    }
  })
  return user
}

export const findAllUsers = async (): Promise<Array<UserPublic>> => {
  const users = await db.user.findMany({
    select: userPublicSelectInput,
  })
  return users
}

export const findAllUsersByCompanyId = async (companyId: string): Promise<Array<UserPublic>> => {
  const users = await db.user.findMany({
    select: userPublicSelectInput,
    where: {
      companyId,
    },
    orderBy: [
      {firstName: `desc`},
      {lastName: `desc`},
    ],
  })
  return users
}

export const authenticateUserWithEmailAndPassword = async (email: string, password: string) => {
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
  const sessionId = createUuid()
  await db.user.update({
    where: {id: user.id},
    data: {
      sessionIds: {push: sessionId},
    },
  })
  return {
    userId: user.id,
    sessionId,
  }
}

export const authenticateUserWithSessionId = async (userId: number, sessionId?: string) => {
  if (!sessionId) return null
  const user = await db.user.findUnique({
    select: {
      ...userPublicSelectInput,
      company: true,
    },
    where: {
      id: userId,
      sessionIds: {
        has: sessionId,
      },
    },
  })
  return user
}