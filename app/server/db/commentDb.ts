import {Comment, Prisma} from "@prisma/client";
import {UserPublic, userPublicSelectInput} from "./userDb";

export type CommentPublic = Omit<Comment, `ticketId` | `userId`> & {
  user: UserPublic;
}

export const commentSelectInput = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  message: true,
  dateSent: true,
  user: {
    select: userPublicSelectInput,
  }
})