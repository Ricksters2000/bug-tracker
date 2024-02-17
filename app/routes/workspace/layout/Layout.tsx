import {Prisma} from "@prisma/client"
import {LoaderFunction, json, redirect} from "@remix-run/node"
import {Outlet, useLoaderData} from "@remix-run/react"
import {LayoutContainer} from "~/routes/workspace/layout/components/LayoutContainer"
import {UserPublic, findUserById} from "~/server/db/userDb"
import {AppContextValue, AppContext} from "../AppContext"

export type WorkspaceLoaderData = UserPublic

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) {
    return redirect(`/auth/login`)
  }
  const user = await findUserById(parseInt(userId))
  if (!user) {
    return redirect(`/auth/login`)
  }
  return json(user)
}

export default function Workspace() {
  const user = useLoaderData<WorkspaceLoaderData>()
  const appContext: AppContextValue = {
    currentUser: user,
  }
  return (
    <LayoutContainer user={user}>
      <AppContext.Provider value={appContext}>
        <Outlet/>
      </AppContext.Provider>
    </LayoutContainer>
  )
}