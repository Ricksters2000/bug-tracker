import {Prisma} from "@prisma/client"
import {LoaderFunction, json, redirect} from "@remix-run/node"
import {Outlet, useLoaderData} from "@remix-run/react"
import {LayoutContainer} from "~/routes/workspace/layout/components/LayoutContainer"
import {UserPublic, findAllUsers, findUserById} from "~/server/db/userDb"
import {AppContextValue, AppContext} from "../AppContext"

export type WorkspaceLoaderData = {
  currentUser: UserPublic;
  allUsers: Array<UserPublic>;
}

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) {
    return redirect(`/auth/login`)
  }
  const user = await findUserById(parseInt(userId))
  if (!user) {
    return redirect(`/auth/login`)
  }
  const users = await findAllUsers()
  const workspaceData: WorkspaceLoaderData = {
    currentUser: user,
    allUsers: users,
  }
  return json(workspaceData)
}

export default function Workspace() {
  const data = useLoaderData<WorkspaceLoaderData>()
  const appContext: AppContextValue = {
    currentUser: data.currentUser,
    allUsers: data.allUsers,
  }
  return (
    <LayoutContainer user={data.currentUser}>
      <AppContext.Provider value={appContext}>
        <Outlet/>
      </AppContext.Provider>
    </LayoutContainer>
  )
}