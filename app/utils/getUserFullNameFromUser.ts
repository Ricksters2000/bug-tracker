import {UserPublic} from "~/server/db/userDb";

export const getUserFullNameFromUser = (user: UserPublic) => `${user.firstName} ${user.lastName}`