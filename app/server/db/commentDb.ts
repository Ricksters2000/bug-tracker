import {Comment, Prisma} from "@prisma/client";
import {UserPublic, userPublicSelectInput} from "./userDb";
import {SerializeFrom} from "@remix-run/node";

export type CommentPublic = Omit<Comment, `ticketId` | `userId`> & {
  user: UserPublic;
}

export const commentSelectInput = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  message: true,
  dateSent: true,
  user: {
    select: userPublicSelectInput,
  },
})

export const serializedCommentToCommentPublic = (jsonComment: SerializeFrom<CommentPublic>): CommentPublic => {
  return {
    ...jsonComment,
    dateSent: new Date(jsonComment.dateSent)
  }
}