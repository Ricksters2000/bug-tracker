import {PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError} from "@prisma/client/runtime/library"

type PrismaError = PrismaClientKnownRequestError | PrismaClientUnknownRequestError | PrismaClientRustPanicError

export const formatPrismaError = (err: PrismaError, helperText?: string): string => {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case `P2002`:
        const target = err.meta?.target as Array<string>
        const field = target[0]
        return `${helperText ? `${helperText} ` : ``}${field} already exists`
    }
  }
  return err.message
}